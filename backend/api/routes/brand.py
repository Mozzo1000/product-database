from flask import Blueprint, request, jsonify
from models import Brand, BrandSchema, db

brand_endpoint = Blueprint('brand', __name__)

@brand_endpoint.route("/v1/brand/<id>")
def get_brand(id):
    brand_schema = BrandSchema(many=False)
    brand = Brand.query.get(id)
    return jsonify(brand_schema.dump(brand))

@brand_endpoint.route("/v1/brand")
def get_brands():
    brand_schema = BrandSchema(many=True)
    brands = Brand.query.all()
    return jsonify(brand_schema.dump(brands))

@brand_endpoint.route("/v1/brand", methods=["POST"])
def add_brand():
    if not "name" in request.json:
        return jsonify({
            "error": "Bad request",
            "message": "name not given"
        }), 400
    new_brand = Brand(name=request.json["name"])
    try:
        new_brand.save_to_db()
        return {
            "id": new_brand.id,
            "name": new_brand.name,
            "created_at": new_brand.created_at
        }, 201
    except:
        return jsonify({'message': 'Something went wrong'}), 500

@brand_endpoint.route('/v1/brand/<id>', methods=["DELETE"])
def remove_brand(id):
    brand = Brand.query.get(id)
    try: 
        db.session.delete(brand)
        db.session.commit()
        return jsonify({'message': f'Brand with id {id} has been removed'}), 200
    except:
        return jsonify({'message': 'Something went wrong'}), 500