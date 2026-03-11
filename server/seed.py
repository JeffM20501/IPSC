#!/usr/bin/env python3
import sys 
import os

sys.path.insert(0,os.path.abspath(os.path.join(os.path.dirname(__file__),'..')))

from server.models import User
from server.app import create_app

from server.config import db

app=create_app()

with app.app_context():

    User.query.delete()
    print('Delete Existing data')
    
    user=User(
        fullname='Jack Snow',
        email='jack@ipsc.com',
        role='admin',
        profile_image="https://i.pravatar.cc/150?img=12"
    )
    user.password_hash='12345'
    
    db.session.add(user)
    db.session.commit()
    
    print('User Created!')
    
