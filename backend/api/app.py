from flask import Flask, url_for
from flask_migrate import Migrate
from flasgger import Swagger
from flask_jwt_extended import JWTManager
from api.config import Config
from api.models import db, ma
from api.routes.auth import auth_endpoint
from api.routes.brand import brand_endpoint
from api.routes.category import category_endpoint
from api.routes.product import product_endpoint
from api.routes.attribute import attribute_endpoint
from api.routes.document import document_endpoint
from api.routes.user import user_endpoint
from api.routes.environment import environment_endpoint
from api.routes.stats import stats_endpoint
from api.routes.favorite import favorite_endpoint
from api.routes.inventory import inventory_endpoint
from api.commands.db import db_command
from api.commands.user import user_command

swagger_template = {
  "swagger": "2.0",
  "info": {
    "title": "product-database API",
    "description": "",
    "version": "1.0.0"
  },
}

app = Flask(__name__)
app.config.from_object(Config)
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