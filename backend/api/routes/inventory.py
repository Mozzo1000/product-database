from flask import Blueprint, request, jsonify
from models import Inventory, InventorySchema, User, db
from flask_jwt_extended import jwt_required, get_jwt_identity

inventory_endpoint = Blueprint('inventory', __name__)

@inventory_endpoint.route("/v1/inventory")
@jwt_required()
def get_inventory_content():
    current_user = User.find_by_email(get_jwt_identity())
    inventory_schema = InventorySchema(many=True)
    inventory = Inventory.query.filter_by(user_id=current_user.id).all()
    return jsonify(inventory_schema.dump(inventory))

@inventory_endpoint.route("/v1/inventory", methods=["POST"])
@jwt_required()
def add_inventory():
    if not "product_id" and "year" and "quantity" in request.json:
        return jsonify({
            "error": "Bad request",
            "message": "product_id, year and/or quantity not given"
        }), 400

    if "cost" in request.json:
        product_cost = request.json["cost"]
    else:
        product_cost = None
    current_user = User.find_by_email(get_jwt_identity())
    new_inventory_item = Inventory(user_id=current_user.id, product_id=request.json["product_id"], 
                                    year=request.json["year"], quantity=request.json["quantity"], cost=product_cost)

    new_inventory_item.save_to_db()
    return jsonify({'message': 'Product added to inventory'}), 201

@inventory_endpoint.route('/v1/inventory/<id>', methods=["DELETE"])
@jwt_required()
def remove_inventory_item(id):
    current_user = User.find_by_email(get_jwt_identity())
    inventory_item = Inventory.query.filter_by(id=id, user_id=current_user.id).first()
    try: 
        db.session.delete(inventory_item)
        db.session.commit()
        return jsonify({'message': f'Product has been removed from inventory'}), 200
    except:
        return jsonify({'message': 'Something went wrong'}), 500