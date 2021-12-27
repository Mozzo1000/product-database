from flask import Flask, url_for
from flask_migrate import Migrate
import config
from models import db, ma
from routes.brand import brand_endpoint
from routes.category import category_endpoint
from routes.product import product_endpoint
from routes.attribute import attribute_endpoint
from routes.document import document_endpoint

app = Flask(__name__)
app.config.from_object(config.Config)
db.init_app(app)
ma.init_app(app)
migrate = Migrate(app, db)

app.register_blueprint(brand_endpoint)
app.register_blueprint(category_endpoint)
app.register_blueprint(product_endpoint)
app.register_blueprint(attribute_endpoint)
app.register_blueprint(document_endpoint)

@app.route('/')
def index():
    import urllib
    output = []
    for rule in app.url_map.iter_rules():
        options = {}
        for arg in rule.arguments:
            options[arg] = "[{0}]".format(arg)

        methods = ','.join(rule.methods)
        url = urllib.parse.unquote(url_for(rule.endpoint, **options))
        #url, methods
        line = {"route:": url, "options": methods}
        output.append(line)

    for line in output:
        print(line)

    return {'name': 'product-database', 'version': '1.0', 'routes': output}