from flask import Blueprint, request, jsonify
from api.models import Environment, EnvironmentSchema, db
from api.utils import admin_required

environment_endpoint = Blueprint('environment', __name__)

@environment_endpoint.route("/v1/environments/<id>")
def get_environment(id):
    environment_schema = EnvironmentSchema(many=False)
    environment = Environment.query.get(id)
    return jsonify(environment_schema.dump(environment))

@environment_endpoint.route("/v1/environments", methods=["POST"])
@admin_required()
def add_environment():
    if not "product_id" and "carbon_footprint" and "carbon_deviation" and \
        "weight_kg_assumption" and "lifetime_year_assumption" and "use_location_assumption" and \
        "assembly_location_assumption" and "source" and "report_created" in request.json:
        return jsonify({
            "error": "Bad request",
            "message": "product_id, carbon_footprint, carbon_deviation, weight_kg_assumption, lifetime_year_assumption, use_location_assumption, assembly_location_assumption, source and/or report_created not given"
        }), 400

    if "carbon_percentage_manufacturing" in request.json:
        carbon_percentage_manufacturing = request.json["carbon_percentage_manufacturing"]
    else:
        carbon_percentage_manufacturing = None
    
    if "carbon_percentage_transportation" in request.json:
        carbon_percentage_transportation = request.json["carbon_percentage_transportation"]
    else:
        carbon_percentage_transportation = None
    
    if "carbon_percentage_eol" in request.json:
        carbon_percentage_eol = request.json["carbon_percentage_eol"]
    else:
        carbon_percentage_eol = None
    
    if "carbon_percentage_use" in request.json:
        carbon_percentage_use = request.json["carbon_percentage_use"]
    else:
        carbon_percentage_use = None

    if "screen_size_assumption" in request.json:
        screen_size_assumption = request.json["screen_size_assumption"]
    else:
        screen_size_assumption = None
    if "energy_demand_kwh_assumption" in request.json:
        energy_demand_kwh_assumption = request.json["energy_demand_kwh_assumption"]
    else:
        energy_demand_kwh_assumption = None

    new_environment = Environment(product_id=request.json["product_id"],
                                    carbon_footprint=request.json["carbon_footprint"],
                                    carbon_deviation=request.json["carbon_deviation"],
                                    weight_kg_assumption=request.json["weight_kg_assumption"],
                                    lifetime_year_assumption=request.json["lifetime_year_assumption"],
                                    use_location_assumption=request.json["use_location_assumption"],
                                    assembly_location_assumption=request.json["assembly_location_assumption"],
                                    source=request.json["source"],
                                    report_created=request.json["report_created"],
                                    carbon_percentage_manufacturing=carbon_percentage_manufacturing,
                                    carbon_percentage_transportation=carbon_percentage_transportation,
                                    carbon_percentage_eol=carbon_percentage_eol,
                                    carbon_percentage_use=carbon_percentage_use,
                                    screen_size_assumption=screen_size_assumption,
                                    energy_demand_kwh_assumption=energy_demand_kwh_assumption)
    new_environment.save_to_db()
    return {
        "id": new_environment.id,
        "product_id": new_environment.product_id,
        "created_at": new_environment.created_at
    }, 201

@environment_endpoint.route('/v1/environments/<id>', methods=["DELETE"])
@admin_required()
def remove_environment(id):
    environment = Environment.query.get(id)
    try: 
        db.session.delete(environment)
        db.session.commit()
        return jsonify({'message': f'Environment with id {id} has been removed'}), 200
    except:
        return jsonify({'message': 'Something went wrong'}), 500