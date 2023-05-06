from flask import Blueprint, request, jsonify
from api.models import Product, ProductSchema, db
from api.utils import admin_required

product_endpoint = Blueprint('product', __name__)

@product_endpoint.route("/v1/products/<id>")
def get_product(id):
    product_schema = ProductSchema(many=False)
    product = Product.query.get(id)
    return jsonify(product_schema.dump(product))

@product_endpoint.route("/v1/products/search/<query>")
def search_for_product(query):
    product_schema = ProductSchema(many=True)
    products = Product.query.filter(Product.name.ilike("%" + query + "%")).all()
    return jsonify(product_schema.dump(products))

@product_endpoint.route("/v1/products")
def get_products():
    product_schema = ProductSchema(many=True)
    page = request.args.get('page', 1, type=int)

    products = Product.query.order_by(Product.created_at.desc())
    if request.args.get('category'):
        products = products.filter_by(category_id=request.args.get('category'))
    if request.args.get('limit'):
        products = products.paginate(page=page, per_page=int(request.args.get("limit")), error_out=False)
        return jsonify(product_schema.dump(products.items))
    else:
        products = products.all()
    
    return jsonify(product_schema.dump(products))

@product_endpoint.route("/v1/products", methods=["POST"])
@admin_required()
def add_product():
    if not "name" in request.json:
        return jsonify({
            "error": "Bad request",
            "message": "name not given"
        }), 400
    if "description" in request.json:
        description = request.json["description"]
    else:
        description = None
    new_product = Product(name=request.json["name"], brand_id=request.json["brand_id"], category_id=request.json["category_id"], description=description)
    new_product.save_to_db()
    return {
        "id": new_product.id,
        "name": new_product.name,
        "brand_id": new_product.brand_id,
        "category_id": new_product.category_id,
        "created_at": new_product.created_at
    }, 201

@product_endpoint.route('/v1/products/<id>', methods=["DELETE"])
@admin_required()
def remove_product(id):
    product = Product.query.get(id)
    try: 
        db.session.delete(product)
        db.session.commit()
        return jsonify({'message': f'Product with id {id} has been removed'}), 200
    except:
        return jsonify({'message': 'Something went wrong'}), 500