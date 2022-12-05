from flask import Blueprint, request, jsonify, abort, send_from_directory, current_app
from werkzeug.utils import secure_filename
from flask_jwt_extended import (create_access_token, create_refresh_token,
                                jwt_required, get_jwt_identity, get_jwt)
from models import User, UserSchema, db
import os
from api.utils import admin_required

user_endpoint = Blueprint('user_endpoint', __name__)

@user_endpoint.route('/v1/users/storage/<path:filename>', methods=['GET'])
def get_image(filename):
    directory = os.path.join(os.getcwd(), current_app.config['UPLOAD_FOLDER_PROFILE'])
    return send_from_directory(directory, filename, as_attachment=False)


@user_endpoint.route("/v1/users/me", methods=["GET"])
@jwt_required()
def get_logged_in_user():
    user_schema = UserSchema(many=False)
    user = User.query.filter_by(email=get_jwt_identity()).first()
    return jsonify(user_schema.dump(user))

@user_endpoint.route("/v1/users/me", methods=["PATCH"])
@jwt_required()
def edit_logged_in_user():        
    user = User.query.filter_by(email=get_jwt_identity()).first()

    if request.files:
        print("MULTIFORM DATA")
        if "image" in  request.files:
            image = request.files["image"]
            if image.filename == "":
                return jsonify({
                    "error": "Bad request",
                    "message": "image is empty"
                }), 400
            image_filename = secure_filename(image.filename)
            image.save(os.path.join(current_app.config["UPLOAD_FOLDER_PROFILE"], image_filename))
            user.image = image_filename
    elif request.json:
        if "name" in request.json:
            user.name = request.json["name"]
        if "email" in request.json:
            user.email = request.json["email"]
        if "password" in request.json:
            user.password = User.generate_hash(request.json["password"])
    else:
        return jsonify({
                    "error": "Bad request",
                    "message": "name, email, password and/or image not given"
        }), 400
    user.save_to_db()
    return jsonify({'message': 'User settings saved'}), 200

@user_endpoint.route('/v1/users', methods=["GET"])
@admin_required()
def get_all_users():
    user_schema = UserSchema(many=True)
    users = User.query.all()
    return jsonify(user_schema.dump(users))

@user_endpoint.route('/v1/users/<id>', methods=["DELETE"])
@admin_required()
def delete_user(id):
    user = User.query.get(id)
    try: 
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': f'User with id {id} has been removed'}), 200
    except:
        return jsonify({'message': 'Something went wrong'}), 500

@user_endpoint.route('/v1/users/<id>/status', methods=["PATCH"])
@admin_required()
def change_user_status_by_id(id):
    if "status" not in request.json:
        return jsonify({
            "error": "Bad request",
            "message": "status not given"
       }), 400
    
    user = User.query.get(id)
    if request.json["status"] == "active" or request.json["status"] == "inactive":
        user.status = request.json["status"]
        user.save_to_db()
        return jsonify({'message': 'Status changed sucessfully.'})
    else:
        return jsonify({'message': 'Invalid status.'}), 400

@user_endpoint.route('/v1/users/<id>/role', methods=["PATCH"])
@admin_required()
def change_user_role_by_id(id):
    if "role" not in request.json:
        return jsonify({
            "error": "Bad request",
            "message": "role not given"
       }), 400
    
    user = User.query.get(id)
    if request.json["role"] == "admin" or request.json["role"] == "user":
        user.role = request.json["role"]
        user.save_to_db()
        return jsonify({'message': 'Role changed sucessfully.'})
    else:
        return jsonify({'message': 'Invalid role.'}), 400
