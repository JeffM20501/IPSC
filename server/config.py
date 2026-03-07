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
    db.init_app(app)
    bcrypt.init_app(app)
    migrate.init_app(app,db)