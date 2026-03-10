from server.app import db
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import relationship

class Sale():
    __tablename__="sales"  

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer,  db.ForeignKey("users.id"), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    total_price = db.Column(db.Decimal, nullable=False)  

    order = db.relationship("Order", bacl_populates="sales")
    

     
