from flask import Blueprint, request, jsonify
from api.models import Product, Brand, db

stats_endpoint = Blueprint('stats', __name__)

@stats_endpoint.route("/v1/stats")
def get_stats():
    product_count = db.session.query(Product).count()
    brand_count = db.session.query(Brand).count()
    return {"products": product_count, "brands": brand_count}
