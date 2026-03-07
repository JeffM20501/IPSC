from flask_restful import Resource
from flask import make_response,abort,request
from ..config import db

class AllResource(Resource):
    def __init__(self, model, resource_items='items', rules=[]):
        super().__init__()
        self.Model=model
        self.resource_items=resource_items
        self.rules=rules
    
    def get(self):
        per_page=int(request.args.get('per_page', 10))
        page=int(request.args.get('page',1))
        
        query=self.Model.query.limit(per_page).offset((page-1)*per_page)
        total_count=self.Model.query.count()
        
        items_dict=[i.to_dict() for i in query.all()]
        return make_response({'data':items_dict, 'total':total_count},200)
    
    def post(self):
        item=self.Model()
        try:
            for field, value in request.json.items():
                setattr(item,field,value)
            db.session.add(item)
            db.session.commit()
            return make_response({'data':item.to_dict(rules=self.rules)}, 200)
        except Exception as e:
            return {'errors':[str(e)]},400


class SingleResource(Resource):
    def __init__(self,model,resource_items='items', rules=[]):
        super().__init__()
        self.Model=model
        self.resource_items=resource_items
        self.rules=rules
        
    def get(self,id):
        item=self.Model.query.filter_by(id=id).first()
        
        if not item:
            abort(404, message=f'{self.resource_items} not found')
        
        return make_response({'data':item.to_dict()},200)
    
    
    def patch(self,id):
        item=self.Model.query.filter_by(id=id).first()
        
        if not item:
            abort(404, message=f'{self.resource_items} not found')
        
        for field,value in request.json.items():
            if hasattr(item,field):
                setattr(item,field,value)
        
        try:
            db.session.commit()
            return make_response({'data':item.to_dict()},201)        
            
        except Exception as e:
            db.session.rollback()
            return {'errors':[str(e)]}, 400
    
    def delete(self,id):
        item=self.Model.query.filter_by(id=id).first()
        
        if not item:
            abort(404, message=f'{self.resource_items} not found')
        
        db.session.delete(item)
        return make_response({}, 204)