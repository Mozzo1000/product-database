from flask import Blueprint, request, jsonify
from api.models import Category, CategorySchema, db
from api.utils import admin_required

category_endpoint = Blueprint('category', __name__)

@category_endpoint.route("/v1/categories/<id>")
def get_category(id):
    category_schema = CategorySchema(many=False)
    category = Category.query.get(id)
    return jsonify(category_schema.dump(category))

@category_endpoint.route("/v1/categories")
def get_categories():
    category_schema = CategorySchema(many=True)
    categories = Category.query.all()
    return jsonify(category_schema.dump(categories))

@category_endpoint.route("/v1/categories", methods=["POST"])
@admin_required()
def add_category():
    if not "name" in request.json:
        return jsonify({
            "error": "Bad request",
            "message": "name not given"
        }), 400
    new_category = Category(name=request.json["name"])
    try:
        new_category.save_to_db()
        return {
            "id": new_category.id,
            "name": new_category.name,
            "created_at": new_category.created_at
        }, 201
    except:
        return jsonify({'message': 'Something went wrong'}), 500

@category_endpoint.route('/v1/categories/<id>', methods=["DELETE"])
@admin_required()
def remove_category(id):
    category = Category.query.get(id)
    try: 
        db.session.delete(category)
        db.session.commit()
        return jsonify({'message': f'Category with id {id} has been removed'}), 200
    except:
        return jsonify({'message': 'Something went wrong'}), 500