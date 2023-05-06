from flask import Blueprint, request, jsonify
from api.models import Brand, BrandSchema, db
from api.utils import admin_required

brand_endpoint = Blueprint('brand', __name__)

@brand_endpoint.route("/v1/brands/<id>")
def get_brand(id):
    """
        Get brand by id
        ---
        tags:
          - brands
        parameters:
          - name: id
            in: path
            description: ID of brand
            required: true
            type: integer
        responses:
          200:
            description: Returns information about the specific brand, empty if none exists.
    """
    brand_schema = BrandSchema(many=False)
    brand = Brand.query.get(id)
    return jsonify(brand_schema.dump(brand))

@brand_endpoint.route("/v1/brands")
def get_brands():
    """
        Get all brands
        ---
        tags:
          - brands
        responses:
          200:
            description: Returns a list of all brands, empty if none exists.        
    """
    brand_schema = BrandSchema(many=True)
    brands = Brand.query.all()
    return jsonify(brand_schema.dump(brands))

@brand_endpoint.route("/v1/brands", methods=["POST"])
@admin_required()
def add_brand():
    """
        Add brand
        ---
        tags:
          - brands
        parameters:
          - name: name
            in: body
            description: Name of brand
            required: true
            type: string
        responses:
          201:
            description: Brand added
          500:
            description: Unknown error occurred
    """
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

@brand_endpoint.route('/v1/brands/<id>', methods=["DELETE"])
@admin_required()
def remove_brand(id):
    """
        Remove brand
        ---
        tags:
          - brands
        parameters:
          - name: id
            in: path
            description: ID of brand
            required: true
            type: integer
        responses:
          200:
            description: Brand removed
          500:
            description: Unknown error occurred
    """
    brand = Brand.query.get(id)
    try: 
        db.session.delete(brand)
        db.session.commit()
        return jsonify({'message': f'Brand with id {id} has been removed'}), 200
    except:
        return jsonify({'message': 'Something went wrong'}), 500