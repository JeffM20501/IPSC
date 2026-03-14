from flask_restful import Resource, abort
from flask import make_response, request, session
from ..config import db
from ..models import Sale, Order


class Login(Resource):
    def __init__(self, model):
        super().__init__()
        self.Model = model
    
    def post(self):
        data = request.get_json()
        
        if not data:
            return {'error': 'No input'}, 400
        
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return {'error': 'Password and email Required'}, 400
        
        user = self.Model.query.filter_by(email=email).first()
        
        if not user or not user.authenticate(password):
            return {'error': 'Invalid password or email'}, 401
        
        session['user_id'] = user.id
        return user.to_dict(), 200


class SignUp(Resource):
    def __init__(self, model):
        super().__init__()
        self.Model = model
    
    def post(self):
        data = request.get_json()
        
        if not data:
            return {'error': 'No Input'}, 400
        
        item = self.Model()
        try:
            for field, value in request.json.items():
                setattr(item, field, value)

            db.session.add(item)
            db.session.commit()
            return make_response({'data': item.to_dict()}, 201)

        except Exception as e:
            return {'error': str(e)}, 400


class CheckSession(Resource):
    def __init__(self, model):
        super().__init__()
        self.Model = model
        
    def get(self):
        user = self.Model.query.filter(self.Model.id == session.get('user_id')).first()
        
        if user:
            return user.to_dict(), 200
        
        return {'message': '401 Not Authorized'}, 401


class Logout(Resource):
    def __init__(self, model):
        super().__init__()
        self.Model = model
        
    def delete(self):
        session.pop('user_id', None)
        return {}, 204


class AllResource(Resource):
    def __init__(self, model, resource_items='items', rules=[]):
        super().__init__()
        self.Model = model
        self.resource_items = resource_items
        self.rules = rules
    
    def authenticate(self):
        if not session.get('user_id'):
            abort(401, message='Authentication required')
    
    def get(self):
        per_page = int(request.args.get('per_page', 10))
        page = int(request.args.get('page', 1))

        try:
            query = self.Model.query.limit(per_page).offset((page - 1) * per_page)
            total_count = self.Model.query.count()
            
            items_dict = [i.to_dict() for i in query.all()]

            return make_response({
                'data': items_dict,
                'total': total_count
            }, 200)

        except Exception as e:
            return {'errors': [str(e)]}, 400
    
    def post(self):
        self.authenticate()

        item = self.Model()

        try:
            for field, value in request.json.items():
                setattr(item, field, value)

            # ---- STOCK + ALERT LOGIC FOR SALES ----
            if self.Model == Sale:
                from ..models import Product, Alert

                product = Product.query.get(item.product_id)

                if product:
                    product.stock_quantity -= item.quantity

                    # Prevent duplicate alerts if stock already low
                    if product.stock_quantity < 10:
                        existing_alert = Alert.query.filter_by(
                            product_id=product.id,
                            status="unread"
                        ).first()

                        if not existing_alert:
                            alert = Alert(
                                message=f"CRITICAL: {product.name} stock is at {product.stock_quantity}",
                                product_id=product.id,
                                status="unread"
                            )
                            db.session.add(alert)

            db.session.add(item)
            db.session.commit()

            return make_response({'data': item.to_dict(rules=self.rules)}, 201)

        except Exception as e:
            db.session.rollback()
            return {'error': [str(e)]}, 400


class UserOrders(AllResource):
    def get(self):
        self.authenticate()

        query = self.Model.query.filter(self.Model.user_id == session.get('user_id'))

        per_page = int(request.args.get('per_page', 10))
        page = int(request.args.get('page', 1))

        try:
            query = query.limit(per_page).offset((page - 1) * per_page)
            total_count = query.count()

            items_dict = [i.to_dict() for i in query.all()]

            return make_response({
                'data': items_dict,
                'total': total_count
            }, 200)

        except Exception as e:
            return {'error': [str(e)]}, 400


class UserSales(Resource):
    def authenticate(self):
        if not session.get('user_id'):
            abort(401, message='Authentication required')
    
    def get(self):
        self.authenticate()

        try:
            sales = Sale.query.join(Order).filter(
                Order.user_id == session['user_id']
            ).all()

            sales_dict = [s.to_dict() for s in sales]

            return make_response({'data': sales_dict}, 200)

        except Exception as e:
            return {'error': [str(e)]}, 400


class SingleResource(Resource):
    def __init__(self, model, resource_items='items', rules=[]):
        super().__init__()
        self.Model = model
        self.resource_items = resource_items
        self.rules = rules
    
    def authenticate(self):
        if not session.get('user_id'):
            abort(401, message='Authentication required')
    
    def get(self, id):
        self.authenticate()
        
        item = self.Model.query.filter_by(id=id).first()
        
        if not item:
            abort(404, message=f'{self.resource_items} not found')
        
        return make_response({'data': item.to_dict()}, 200)
    
    def patch(self, id):
        item = self.Model.query.filter_by(id=id).first()
        
        if not item:
            abort(404, message=f'{self.resource_items} not found')
        
        for field, value in request.json.items():
            if hasattr(item, field):
                setattr(item, field, value)
        
        try:
            db.session.commit()
            return make_response({'data': item.to_dict()}, 200)

        except Exception as e:
            db.session.rollback()
            return {'error': [str(e)]}, 400
    
    def delete(self, id):
        self.authenticate()

        item = self.Model.query.filter_by(id=id).first()
        
        if not item:
            abort(404, message=f'{self.resource_items} not found')
        
        db.session.delete(item)
        db.session.commit()

        return make_response({}, 204)