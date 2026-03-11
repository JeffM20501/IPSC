from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property


from ..config import db, bcrypt

class User(db.Model, SerializerMixin):
    __tablename__='users'
    serialize_rules=('-orders.user',)
    
    id=db.Column(db.Integer, primary_key=True)
    fullname=db.Column(db.String, nullable=False)
    email =db.Column(db.String, unique=True, nullable=False)
    _password_hash=db.Column(db.String, nullable=False)
    role=db.Column(db.String, default='staff')
    profile_image=db.Column(db.String)
    created_at=db.Column(db.DateTime, server_default=db.func.now())
    updated_at=db.Column(db.DateTime, server_default=db.func.now())
    
    # orders=db.relationship('Order', backref='user')
    
    @validates('fullname')
    def validate_fullname(self,key,fullname):
        if fullname and isinstance(fullname, str):
            return fullname
        raise ValueError('Full name needs to be present and a string')
    
    @validates('email')
    def validate__email(self,key,email):
        if email and '@' in email:
            return email
        raise ValueError('Email needs to be present and of the correct format')
    
    @validates('role')
    def validate_role(self,key,role):
        if role and isinstance(role,str):
            return role
        raise ValueError("Role needs to be present and a string. Default role is 'staff'.")
    
    
    def __repr__(self):
        return f'<User id:{self.id}, name:{self.fullname}, email:{self.email}'
    
    @hybrid_property
    def password_hash(self):
        raise AttributeError('Can not access Attribute')
    
    @password_hash.setter
    def password_hash(self,password):
        # if not password and len(password)<8:
        #     raise ValueError('Password needs to be present and have at least 8 characters long')
        
        password_hash=bcrypt.generate_password_hash(password.encode('utf-8'))
        
        self._password_hash=password_hash.decode('utf-8')
        
        
    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))