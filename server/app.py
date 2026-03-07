#!/usr/bin/env python3
from flask import Flask
from .config import app
from  .models import *
from  .routes import api_pb

def create_app():
    
    app.register_blueprint(api_pb)

    return app
