from flask import Blueprint, request, jsonify
from models import Favorite, FavoriteSchema, User, db
from flask_jwt_extended import jwt_required, get_jwt_identity

favorite_endpoint = Blueprint('favorite', __name__)

@favorite_endpoint.route("/v1/favorites")
@jwt_required()
def get_favorites():
    current_user = User.find_by_email(get_jwt_identity())
    favorite_schema = FavoriteSchema(many=True)
    favorites = Favorite.query.filter_by(user_id=current_user.id).all()
    return jsonify(favorite_schema.dump(favorites))

@favorite_endpoint.route("/v1/favorites/<id>")
@jwt_required()
def get_is_favorite(id):
    current_user = User.find_by_email(get_jwt_identity())
    print(current_user)
    favorite = Favorite.query.filter_by(product_id=id, user_id=current_user.id).first()
    if favorite:
        return jsonify({'favorite': True}), 201
    else:
        return jsonify({'favorite': False}), 201


@favorite_endpoint.route("/v1/favorites", methods=["POST"])
@jwt_required()
def add_favorite():
    if not "product_id" in request.json:
        return jsonify({
            "error": "Bad request",
            "message": "product_id not given"
        }), 400
    current_user = User.find_by_email(get_jwt_identity())
    new_favorite = Favorite(user_id=current_user.id, product_id=request.json["product_id"])

    new_favorite.save_to_db()
    return jsonify({'message': 'Favorite added'}), 201

@favorite_endpoint.route('/v1/favorites/<id>', methods=["DELETE"])
@jwt_required()
def remove_favorite(id):
    current_user = User.find_by_email(get_jwt_identity())
    favorite = Favorite.query.filter_by(product_id=id, user_id=current_user.id).first()
    try: 
        db.session.delete(favorite)
        db.session.commit()
        return jsonify({'message': f'Favorite has been removed'}), 200
    except:
        return jsonify({'message': 'Something went wrong'}), 500