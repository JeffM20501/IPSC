from server.config import db
from flask import Blueprint, jsonify, request

class Alert(db.Model):
    __tablename__ = 'alerts'

    id = db.Column(db.Integer, primary_key=True)
    message = db.Column(db.String(255), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=True)
    status = db.Column(db.String(20), nullable=False, default='unread')
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    def to_dict(self):
        return {
            "id": self.id,
            "message": self.message,
            "product_id": self.product_id,
            "status": self.status,
            "created_at": self.created_at.isoformat()
        }

alerts_bp = Blueprint('alerts_bp', __name__)

# Get all alerts
@alerts_bp.route('/alerts', methods=['GET'])
def get_alerts():
    alerts = Alert.query.order_by(Alert.created_at.desc()).all()
    return jsonify({"data": [alert.to_dict() for alert in alerts]}), 200

# Get unread alerts
@alerts_bp.route('/alerts/unread', methods=['GET'])
def get_unread_alerts():
    unread_alerts = Alert.query.filter_by(status='unread').order_by(Alert.created_at.desc()).all()
    return jsonify({"data": [alert.to_dict() for alert in unread_alerts]}), 200

# Update alert status
@alerts_bp.route('/alerts/<int:id>', methods=['PATCH'])
def update_alert(id):
    alert = Alert.query.get_or_404(id)
    data = request.get_json() or {}

    if 'status' in data and data['status'] in ['read', 'unread']:
        alert.status = data['status']
        db.session.commit()

    return jsonify({"data": alert.to_dict()}), 200

# Delete alert
@alerts_bp.route('/alerts/<int:id>', methods=['DELETE'])
def delete_alert(id):
    alert = Alert.query.get_or_404(id)
    db.session.delete(alert)
    db.session.commit()
    return jsonify({"data": {"message": "Alert deleted successfully"}}), 200