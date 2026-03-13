from flask import   Blueprint
from flask_restful import Api
from ..services.base_resource import *
from ..models import User,Order
api_pb=Blueprint('api_bp',__name__)
api_v1=Api(api_pb,prefix='/api/v1')

@api_pb.route('/test')
def test():
    return{'message':"Works!"}

api_v1.add_resource(
    Login,
    '/login',
    endpoint='login',
    resource_class_args=(User,)
)

api_v1.add_resource(
    SignUp,
    '/signup',
    endpoint='/signup',
    resource_class_args=(User,)
)

api_v1.add_resource(
    CheckSession,
    '/check_session',
    endpoint='/check_session',
    resource_class_args=(User,)
)

api_v1.add_resource(
    Logout,
    '/logout',
    endpoint='/logout',
    resource_class_args=(User,)
)

api_v1.add_resource(
    UserOrders,
    '/users/me/orders',
    endpoint='/users/me/orders',
    resource_class_args=(Order,'Order',[])
)

api_v1.add_resource(
    UserSales,
    '/users/me/sales',
    endpoint='/users/me/sales',
    )

def create_routes(endpoint, model,resource_items,rules=[]):
    print(f"Adding routes for {resource_items} at {endpoint}")
    
    api_v1.add_resource(
        AllResource,
        endpoint,
        endpoint=endpoint,
        resource_class_args=(model,resource_items,rules)
    )

    api_v1.add_resource(
        SingleResource,
        f'{endpoint}/<int:id>',
        endpoint=f'{endpoint}/<int:id>',
        resource_class_args=(model,resource_items,rules)
    )
