#!/usr/bin/env python3
import sys 
import os
from server.models import User, Supplier, Product, Order, Sale, Alert 
from server.config import db
from server.app import create_app

app = create_app()

with app.app_context():
    print("Creating database tables if they don't exist...")
    db.create_all()

    print("Clearing old data...")
    Alert.query.delete()
    Sale.query.delete()
    Product.query.delete()
    Supplier.query.delete()
    User.query.delete()
    db.session.commit()
    print('Deleted existing data')

    users = [
        User(fullName='Jack Snow', email='runn@ipsc.com', role='admin', profile_image="https://i.pravatar.cc/150?img=12"),
        User(fullName='Alice Johnson', email='alice@ipsc.com', role='staff', profile_image="https://i.pravatar.cc/150?img=5"),
        User(fullName='Bob Smith', email='bob@ipsc.com', role='staff', profile_image="https://i.pravatar.cc/150?img=10")
    ]
    for u in users:
        u.password_hash = '12345'
        db.session.add(u)
    
    supplier = Supplier(name='Global Tech Corp', contact='supply@tech.com')
    db.session.add(supplier)
    db.session.flush() 

    products = [
        Product(name='Laptop Pro 15', price=1200.00, stock_quantity=5, supplier_id=supplier.id),
        Product(name='Wireless Mouse', price=25.00, stock_quantity=50, supplier_id=supplier.id),
        Product(name='Mechanical Keyboard', price=80.00, stock_quantity=20, supplier_id=supplier.id)
    ]
    for p in products:
        db.session.add(p)
    db.session.flush() 

    alerts = [
        Alert(message=f"CRITICAL: {products[0].name} is running low on stock!", product_id=products[0].id, status="unread"),
        Alert(message=f"New supplier GTC successfully integrated", product_id=products[0].id, status="read"),
        Alert(message=f"WARNING: {products[2].name} stock below 25 units", product_id=products[2].id, status="unread"),
        Alert(message=f"INFO: {products[1].name} is fully stocked", product_id=products[1].id, status="read")
    ]
    for a in alerts:
        db.session.add(a)

    db.session.commit()
    print("Database seeded with Users, Products, and Alerts!")