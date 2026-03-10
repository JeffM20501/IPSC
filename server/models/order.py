from server.app import db
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import relationship

class Order(db.Model, SerializerMixin):
    __tablename__ = "orders" 

    serialize_rules = ("-") 

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer,  db.ForeignKey("users.id"), nullable=False)
    order_date = db.Column(db.DateTime, server_default=db.func.now())
    status = db.Column(db.String, nullable=False)
    total_amount = db.Column(db.Numeric, nullable=False) 


