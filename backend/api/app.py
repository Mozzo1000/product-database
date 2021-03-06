from flask import Flask, url_for
from flask_migrate import Migrate
from flasgger import Swagger
from flask_jwt_extended import JWTManager
import config
from models import db, ma
from routes.auth import auth_endpoint
from routes.brand import brand_endpoint
from routes.category import category_endpoint
from routes.product import product_endpoint
from routes.attribute import attribute_endpoint
from routes.document import document_endpoint
from routes.user import user_endpoint
from routes.environment import environment_endpoint
from routes.stats import stats_endpoint
from routes.favorite import favorite_endpoint
from routes.inventory import inventory_endpoint
from commands.db import db_command
from commands.user import user_command

swagger_template = {
  "swagger": "2.0",
  "info": {
    "title": "product-database API",
    "description": "",
    "version": "1.0.0"
  },
}

app = Flask(__name__)
app.config.from_object(config.Config)
db.init_app(app)
ma.init_app(app)
migrate = Migrate(app, db)
swagger = Swagger(app, template=swagger_template)
jwt = JWTManager(app)

app.register_blueprint(db_command)
app.register_blueprint(user_command)

app.register_blueprint(auth_endpoint)
app.register_blueprint(brand_endpoint)
app.register_blueprint(category_endpoint)
app.register_blueprint(product_endpoint)
app.register_blueprint(attribute_endpoint)
app.register_blueprint(document_endpoint)
app.register_blueprint(user_endpoint)
app.register_blueprint(environment_endpoint)
app.register_blueprint(stats_endpoint)
app.register_blueprint(favorite_endpoint)
app.register_blueprint(inventory_endpoint)

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