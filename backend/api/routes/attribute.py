from flask import Blueprint, request, jsonify
from models import Attribute, AttributeSchema, db

attribute_endpoint = Blueprint('attribute', __name__)

@attribute_endpoint.route("/v1/attribute/<id>")
def get_attribute(id):
    attribute_schema = AttributeSchema(many=False)
    attribute = Attribute.query.get(id)
    return jsonify(attribute_schema.dump(attribute))

@attribute_endpoint.route("/v1/attribute")
def get_attributes():
    attribute_schema = AttributeSchema(many=True)
    attributes = Attribute.query.all()
    return jsonify(attribute_schema.dump(attributes))

@attribute_endpoint.route("/v1/attribute", methods=["POST"])
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

@attribute_endpoint.route('/v1/attribute/<id>', methods=["DELETE"])
def remove_attribute(id):
    attribute = Attribute.query.get(id)
    try: 
        db.session.delete(attribute)
        db.session.commit()
        return jsonify({'message': f'Attribute with id {id} has been removed'}), 200
    except:
        return jsonify({'message': 'Something went wrong'}), 500