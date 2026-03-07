from flask import   Blueprint
from flask_restful import Api
from ..models import *
from ..services.base_resource import *

api_pb=Blueprint('api_bp',__name__)
api_v1=Api(api_pb,prefix='/api/v1')


api_v1.add_resource(
    AllResource,
    '/users',
    endpoint='/users',
    resource_class_args=(User, 'User')
)

api_v1.add_resource(
    SingleResource,
    '/users/<int:id>',
    endpoint='/users/<int:id>',
    resource_class_args=(User, 'User')
)
