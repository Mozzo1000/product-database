from flask import Blueprint, request, jsonify, abort
from flask_jwt_extended import (create_access_token, create_refresh_token,
                                jwt_required, get_jwt_identity, get_jwt)
from models import User, UserSchema

user_endpoint = Blueprint('user', __name__)

@user_endpoint.route("/v1/users/me", methods=["GET"])
@jwt_required()
def get_logged_in_user():
    user_schema = UserSchema(many=False)
    user = User.query.filter_by(email=get_jwt_identity()).first()
    return jsonify(user_schema.dump(user))

@user_endpoint.route("/v1/users/me", methods=["PUT"])
@jwt_required()
def edit_logged_in_user():
    if not "name" and "email" in request.json:
        return jsonify({
            "error": "Bad request",
            "message": "name and/or email not given"
        }), 400
    user = User.query.filter_by(email=get_jwt_identity()).first()    
    user.name = request.json["name"]
    user.email = request.json["email"]
    user.save_to_db()
    return jsonify({'message': 'User settings saved'}), 200


