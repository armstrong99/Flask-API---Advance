from flask import Blueprint, jsonify, g
from ..models.user import User 
from flask_cors import cross_origin
from flask import request
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

users_bp = Blueprint('users', __name__)

@users_bp.route('/me', methods=['GET']) 
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True)
def me():
    user = User.query.get(g.user_id)
    logger.debug(f"User ID: {g.user_id}")
    logger.debug(f"User: {user.to_dict() if user else 'None'}")
    if not user:
        return jsonify(msg="User not found"), 404
    
    # Check if the user is an admin
    return jsonify(user=user.to_dict()), 200
