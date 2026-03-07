#!/usr/bin/env python3
from flask import Flask,make_response
from werkzeug.exceptions import NotFound
from .config import config_app
from  .models import *
from  .routes import api_pb

def create_app():
    
    app=Flask(__name__)
    config_app(app)
    app.register_blueprint(api_pb)

    return app
