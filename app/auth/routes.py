from flask import Blueprint, request, jsonify, make_response
from flask_jwt_extended import create_access_token, create_refresh_token
from ..models.user import User
from ..extensions import db
from .schema import RegisterSchema
from marshmallow import ValidationError
from datetime import timedelta

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        # Validate and load data
        data = RegisterSchema().load(request.json)

        # Check if user with email already exists
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            return jsonify(msg="Email already registered"), 409  # 409 = Conflict

        # Create and save new user
        user = User(full_name=data['full_name'], email=data['email'])
        user.set_password(data['password'])
        db.session.add(user)
        db.session.commit()

        print("User Created: ", user)
        return jsonify(msg="User created", user=user.to_dict()), 201

    except ValidationError as err:
        return jsonify(msg="Validation Failed", errors=err.messages), 422

    except Exception as e:
        print("Unexpected error:", str(e))
        return jsonify(msg="Something went wrong", error=str(e)), 500

  
   

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first_or_404()
    if not user.check_password(data['password']):
        return jsonify(msg="Bad credentials"), 401

    expires = timedelta(hours=24)
    access = create_access_token(identity=str(user.id), expires_delta=expires)
    refresh = create_refresh_token(identity=str(user.id), expires_delta=expires)

    resp = make_response(jsonify(msg="Logged in", user=user.to_dict()))
    resp.set_cookie(
        'access_token_cookie', access,
        httponly=False, secure=False, samesite='Lax'
    )  # Adjust httponly/secure for production
    resp.set_cookie(
        'refresh_token_cookie', refresh,
        httponly=False, secure=False, samesite='Lax'
    )
    return resp
