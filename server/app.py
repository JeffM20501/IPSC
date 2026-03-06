#!/usr/bin/env python3
from flask import Flask
from dotenv import load_dotenv
from flask_migrate import Migrate
from .models.dbconn import db

load_dotenv()
def create_app():
    app = Flask(__name__)
    app.config.from_prefixed_env()
    
    Migrate(app,db)
    db.init_app(app)
    
    # @app.route("/")
    # def hello():
    #     return "Hello, World!"

    return app
