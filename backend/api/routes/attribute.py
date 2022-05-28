from flask import Blueprint, request, jsonify
from models import Attribute, AttributeSchema, db
from api.utils import admin_required

attribute_endpoint = Blueprint('attribute', __name__)

@attribute_endpoint.route('/v1/attributes/<id>', methods=["PUT"])
@admin_required()
def edit_attribute(id):
    if not "name" and "value" in request.json:
        return jsonify({
            "error": "Bad request",
            "message": "name and/or value not given"
        }), 400
    attribute = Attribute.query.get(id)
    attribute.name = request.json["name"]
    attribute.value = request.json["value"]
    attribute.save_to_db()
    return jsonify({'message': f'Attribute with id {id} has been edited'}), 200

@attribute_endpoint.route("/v1/attributes/<id>")
def get_attribute(id):
    attribute_schema = AttributeSchema(many=False)
    attribute = Attribute.query.get(id)
    return jsonify(attribute_schema.dump(attribute))

@attribute_endpoint.route("/v1/attributes")
def get_attributes():
    attribute_schema = AttributeSchema(many=True)
    attributes = Attribute.query.all()
    return jsonify(attribute_schema.dump(attributes))

@attribute_endpoint.route("/v1/attributes", methods=["POST"])
@admin_required()
def add_attribute():
    if not "name" in request.json:
        return jsonify({
            "error": "Bad request",
            "message": "name not given"
        }), 400
    new_attribute = Attribute(product_id=request.json["product_id"], name=request.json["name"], value=request.json["value"])
    new_attribute.save_to_db()
    return {
        "id": new_attribute.id,
        "product_id": new_attribute.product_id,
        "name": new_attribute.name,
        "value": new_attribute.value,
        "created_at": new_attribute.created_at
    }, 201

@attribute_endpoint.route('/v1/attributes/<id>', methods=["DELETE"])
@admin_required()
def remove_attribute(id):
    attribute = Attribute.query.get(id)
    try: 
        db.session.delete(attribute)
        db.session.commit()
        return jsonify({'message': f'Attribute with id {id} has been removed'}), 200
    except:
        return jsonify({'message': 'Something went wrong'}), 500