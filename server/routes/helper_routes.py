from flask import   Blueprint
from flask_restful import Api
from ..services.base_resource import *

api_pb=Blueprint('api_bp',__name__)
api_v1=Api(api_pb,prefix='/api/v1')

@api_pb.route('/test')
def test():
    return{'message':"Works!"}

def create_routes(endpoint, model,name,rules=[]):
    print(f"Adding routes for {name} at {endpoint}")

    api_v1.add_resource(
        AllResource,
        endpoint,
        endpoint=endpoint,
        resource_class_args=(model,name,rules)
    )

    api_v1.add_resource(
        SingleResource,
        f'{endpoint}/<int:id>',
        endpoint=f'{endpoint}/<int:id>',
        resource_class_args=(model,name,rules)
)
