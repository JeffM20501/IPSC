#!/usr/bin/env python3
from flask_migrate import Migrate  
from server.config import db
from flask import Flask,make_response
from werkzeug.exceptions import NotFound
from .config import config_app
from  .models import *
from  .routes import api_pb

migrate = Migrate()

def create_app():
    
    app=Flask(__name__)
    config_app(app)
    migrate.init_app(app, db)
    app.register_blueprint(api_pb)

    return app


def create_app():
    
    app=Flask(__name__)
    config_app(app)
    app.register_blueprint(api_pb)

    return app
