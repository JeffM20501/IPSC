
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import  relationship 
from ..config import db


class Order(db.Model, SerializerMixin): 

    __tablename__ = "orders" 
    
    serialize_rules = ("-sales.order",)  
   


    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer,  db.ForeignKey("users.id"), nullable=False)
    order_date = db.Column(db.DateTime, server_default=db.func.now())
    status = db.Column(db.String, nullable=False)
    total_amount = db.Column(db.Numeric(10), nullable=False) 

    sales = db.relationship("Sale", backref="order", cascade="all, delete-orphan") 

from .sale import Sale
from sqlalchemy import Column, Integer, ForeignKey

# This "monkey-patches" the missing link without editing sale.py
if not hasattr(Sale, 'order_id'):
    Sale.order_id = Column(Integer, ForeignKey('orders.id'))

