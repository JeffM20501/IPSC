
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import relationship 
from ..config import db

class Sale(db.Model, SerializerMixin):
    __tablename__="sales"  
    serialize_rule = ("-order.sales")

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer,  db.ForeignKey("users.id"), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    total_price = db.Column(db.Numeric(10,2), nullable=False)  

    # order = db.relationship("Order", back_populates="sales")


     
