from flask import Flask
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from dotenv import load_dotenv

load_dotenv()

app=Flask(__name__)
app.config.from_prefixed_env()

metadata=MetaData()
db=SQLAlchemy(metadata=metadata)

Migrate(app,db)
db.init_app(app)

bcrypt=Bcrypt(app)
