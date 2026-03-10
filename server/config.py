from flask import Flask
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from dotenv import load_dotenv

load_dotenv()

metadata=MetaData()
db=SQLAlchemy(metadata=metadata)
migrate=Migrate()

bcrypt=Bcrypt()

def config_app(app):
    app.config.from_prefixed_env()
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///app.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.json.compact = False

    db.init_app(app)
    bcrypt.init_app(app)
    migrate.init_app(app, db)