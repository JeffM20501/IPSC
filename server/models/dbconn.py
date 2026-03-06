from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData

metadata=MetaData()
db=SQLAlchemy(metadata=metadata)