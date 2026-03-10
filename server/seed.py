#!/usr/bin/env python3
import sys 
import os
from server.models import User, Supplier, Product, Order, Sale, Alert 
from server.config import db
from server.app import create_app

app = create_app()

with app.app_context():
    print("Clearing old data...")

    Alert.query.delete()
    Sale.query.delete()
    Product.query.delete()
    Supplier.query.delete()
    User.query.delete()
    print('Delete Existing data')
    
    user=User(
        fullname='Jack Snow',
        email='runn@ipsc.com',
        role='admin',
        profile_image="https://i.pravatar.cc/150?img=12"
    )
    user.password_hash='12345'
    
    db.session.add(user)
    db.session.commit()

    # user
    user = User(fullName='Jack Snow', email='runn@ipsc.com', role='admin')
    user.password_hash = '12345'
    db.session.add(user)

    # supplier
    supplier = Supplier(name='Global Tech Corp', contact='supply@tech.com')
    db.session.add(supplier)
    db.session.flush()

    # product
    product = Product(
        name='Laptop Pro 15',
        price=1200.00,
        stock_quantity=5,
        supplier_id=supplier.id
    )
    product2 = Product(
        name='Wireless Mouse',
        price=25.00,
        stock_quantity=50,
        supplier_id=supplier.id
    )
    db.session.add(product)
    db.session.add(product2)
    db.session.flush()

    print("Creating Alerts...")
    alert1 = Alert(
        message=f"CRITICAL: {product.name} is running low on stock!",
        product_id=product.id,
        status="unread"
    )
    alert2 = Alert(
        message=f"New supplier GTC successfully integrated",
        product_id=product.id,
        status="read"
    )
    db.session.add_all([alert1, alert2])

    db.session.commit()

    print("Database seeded with Users, Products, and Alerts!")