from flask import   Blueprint
from flask_restful import Api
from ..services.base_resource import *

api_pb=Blueprint('api_bp',__name__)
api_v1=Api(api_pb,prefix='/api/v1')


def create_routes(endpoint, model_tuple=()):
    
    model,name,rules=model_tuple

    api_v1.add_resource(
        AllResource,
        endpoint=endpoint,
        resource_class_args=(model,name,rules)
    )

    api_v1.add_resource(
        SingleResource,
        endpoint=f'{endpoint}/<int:id>',
        resource_class_args=(model,name,rules)
)
