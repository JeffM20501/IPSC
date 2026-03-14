#!/usr/bin/env python3
from server.config import db
from server.models import User, Supplier, Product, Order, Sale, Alert
from server.app import create_app
from sqlalchemy import text
from faker import Faker
import random
from datetime import datetime, timedelta

app = create_app()
fake = Faker()

NUM_RANDOM_USERS = 3
NUM_SUPPLIERS = 3
NUM_PRODUCTS = 10
NUM_ORDERS = 15
NUM_SALES = 20
NUM_ALERTS = 10

def random_date_within(days=30):
    return datetime.now() - timedelta(days=random.randint(0, days), hours=random.randint(0,23), minutes=random.randint(0,59))

with app.app_context():
    print("Creating database tables if they don't exist...")
    db.create_all()

    print("Clearing old data...")
    db.session.execute(text(f'DELETE FROM {Alert.__tablename__}'))
    db.session.execute(text(f'DELETE FROM {Sale.__tablename__}'))
    db.session.execute(text(f'DELETE FROM {Order.__tablename__}'))
    db.session.execute(text(f'DELETE FROM {Product.__tablename__}'))
    db.session.execute(text(f'DELETE FROM {Supplier.__tablename__}'))
    db.session.execute(text(f'DELETE FROM {User.__tablename__}'))
    db.session.commit()

    print("Seeding Users...")
    users = []

    # Fixed users
    fixed_users = [
        {"fullname": "Alice Johnson", "email": "alice@ipsc.com", "role": "admin"},
        {"fullname": "Bob Smith", "email": "bob@ipsc.com", "role": "staff"},
        {"fullname": "Charlie Davis", "email": "charlie@ipsc.com", "role": "staff"}
    ]
    for udata in fixed_users:
        u = User(
            fullname=udata["fullname"],
            email=udata["email"],
            role=udata["role"],
            profile_image=f"https://i.pravatar.cc/150?img={random.randint(1,70)}"
        )
        u.password_hash = "12345"
        db.session.add(u)
        users.append(u)

    # Random
    for _ in range(NUM_RANDOM_USERS):
        u = User(
            fullname=fake.name(),
            email=fake.unique.email(),
            role=random.choice(["admin", "staff"]),
            profile_image=f"https://i.pravatar.cc/150?img={random.randint(1,70)}"
        )
        u.password_hash = "12345"
        db.session.add(u)
        users.append(u)
    db.session.flush()

    print("Fixed users for login:")
    for u in users:
        print(f"{u.fullname} | {u.email} | password: 12345")

    # Suppliers
    suppliers = []
    for _ in range(NUM_SUPPLIERS):
        s = Supplier(
            name=fake.company(),
            contact=fake.email()
        )
        db.session.add(s)
        suppliers.append(s)
    db.session.flush()

    # Products
    products = []
    for _ in range(NUM_PRODUCTS):
        product = Product(
            name=fake.word().capitalize(),
            price=round(random.uniform(10, 2000), 2),
            stock_quantity=random.randint(1, 100),
            supplier_id=random.choice(suppliers).id
        )
        db.session.add(product)
        products.append(product)
    db.session.flush()

    # Orders
    orders = []
    for _ in range(NUM_ORDERS):
        o = Order(
            user_id=random.choice(users).id,
            total_amount=random.randint(1000, 50000),
            order_date=random_date_within()
        )
        db.session.add(o)
        orders.append(o)
    db.session.flush()

    # Sales
    for _ in range(NUM_SALES):
        product = random.choice(products)
        quantity = random.randint(1, 5)
        sale = Sale(
            user_id=random.choice(users).id,
            product_id=product.id,
            quantity=quantity,
            total_price=round(product.price * quantity, 2),
            created_at=random_date_within()
        )
        db.session.add(sale)

    # Seed Alerts
    for _ in range(NUM_ALERTS):
        product = random.choice(products)
        status = random.choice(["read", "unread"])
        level = "CRITICAL" if product.stock_quantity < 10 else random.choice(["WARNING", "INFO"])
        message = f"{level}: {product.name} stock is at {product.stock_quantity}"
        alert = Alert(
            message=message,
            product_id=product.id,
            status=status,
            created_at=random_date_within()
        )
        db.session.add(alert)

    db.session.commit()
    print("Database seeded with Users, Suppliers, Products, Orders, Sales, and Alerts!")