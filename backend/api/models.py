from enum import unique
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()
ma = Marshmallow()

class Brand(db.Model):
    __tablename__ = "brand"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

class BrandSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Brand

class Category(db.Model):
    __tablename__ = "category"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

class CategorySchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Category

class Attribute(db.Model):
    __tablename__ = "attribute"
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'))
    name = db.Column(db.String, nullable=False)
    value = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

class AttributeSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Attribute

class Product(db.Model):
    __tablename__ = "product"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    brand_id = db.Column(db.Integer, db.ForeignKey('brand.id'))
    brand = db.relationship("Brand", uselist=False, backref="brand")
    description = db.Column(db.String, nullable=True)

    category_id = db.Column(db.Integer, db.ForeignKey('category.id'))
    category = db.relationship("Category", uselist=False, backref="category")
    
    attribute = db.relationship("Attribute", uselist=True, backref="attribute")

    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

class ProductSchema(ma.SQLAlchemyAutoSchema):
    category = ma.Nested(CategorySchema, many=False)
    brand = ma.Nested(BrandSchema, many=False)
    attribute = ma.List(ma.Nested(AttributeSchema(only=("id", "name","value",))))

    cover_image = ma.Method("get_cover_image")

    def get_cover_image(self, obj):
        query = Document.query.filter(Document.product_id==obj.id, Document.type.contains("image/")).order_by(Document.order.desc()).first()
        if query:
            return query.name
        else:
            return None

    class Meta:
        model = Product

class Document(db.Model):
    __tablename__ = "document"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True)
    type = db.Column(db.String, nullable=False)
    size = db.Column(db.Integer, nullable=True)
    file_created_at = db.Column(db.Date, nullable=True)
    checksum = db.Column(db.String, nullable=True)
    order = db.Column(db.Integer, server_default="1", nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'))
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

class DocumentSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Document

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, nullable=False, unique=True)
    name = db.Column(db.String, nullable=False)
    password = db.Column(db.String, nullable=False)
    image = db.Column(db.String, nullable=True)
    role = db.Column(db.String, default="user")
    status = db.Column(db.String, default="active")

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def find_by_email(cls, email):
        return cls.query.filter_by(email=email).first()

    @staticmethod
    def generate_hash(password):
        return generate_password_hash(password)

    @staticmethod
    def verify_hash(password, hash):
        return check_password_hash(hash, password)

class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        fields = ("id", "name", "email", "image", "role", "status")


class RevokedTokenModel(db.Model):
    __tablename__ = 'revoked_tokens'

    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(120))

    def add(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def is_jti_blacklisted(cls, jti):
        query = cls.query.filter_by(jti=jti).first()
        return bool(query)

class EnvironmentManufacturingComponent(db.Model):

    __tablename__ = "environment_manufacturing_component"

    id = db.Column(db.Integer, primary_key=True)
    environment_id = db.Column(db.Integer, db.ForeignKey('environment.id'))
    name = db.Column(db.String, nullable=False)
    percentage = db.Column(db.Integer, nullable=False)


    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

class Environment(db.Model):
    __tablename__ = "environment"

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'))

    carbon_footprint = db.Column(db.Integer, nullable=False) # Dell, HP, Lenovo
    carbon_deviation = db.Column(db.Integer, nullable=False) # Dell, HP, Lenovo

    carbon_percentage_manufacturing = db.Column(db.Float, nullable=True) # Dell, Lenovo
    carbon_percentage_transportation = db.Column(db.Float, nullable=True) # Dell, Lenovo
    carbon_percentage_eol = db.Column(db.Float, nullable=True) # Dell, Lenovo
    carbon_percentage_use = db.Column(db.Float, nullable=True) # Dell, Lenovo

    carbon_percentage_manufacturing_components = db.relationship("EnvironmentManufacturingComponent", uselist=True, backref="environment_manufacturing_component")

    weight_kg_assumption = db.Column(db.Float, nullable=False) # Dell, HP, Lenovo
    lifetime_year_assumption = db.Column(db.Integer, nullable=False) # Dell, HP, Lenovo
    screen_size_assumption = db.Column(db.Integer, nullable=True) # Dell, HP, Lenovo
    use_location_assumption = db.Column(db.String, nullable=False) # Dell, HP, Lenovo
    assembly_location_assumption = db.Column(db.String, nullable=False) # Dell, HP, Lenovo
    energy_demand_kwh_assumption = db.Column(db.Float, nullable=True) # Dell, HP

    source = db.Column(db.String, nullable=False) # Dell, HP, Lenovo

    report_created = db.Column(db.Date, nullable=False) # Dell, HP, Lenovo
    
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

class EnvironmentSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Environment

class Favorite(db.Model):
    __tablename__ = "favorite"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'))
    product = db.relationship("Product", uselist=False, backref="product")
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

class FavoriteSchema(ma.SQLAlchemyAutoSchema):
    product = ma.Nested(ProductSchema, many=False, only=("brand.name","category.name", "name", "description", "cover_image", "id",))

    class Meta:
        model = Favorite

class Inventory(db.Model):
    __tablename__ = "inventory"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'))
    product = db.relationship("Product", uselist=False)
    year = db.Column(db.Integer)
    quantity = db.Column(db.Integer)
    cost = db.Column(db.Integer, nullable=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

class InventorySchema(ma.SQLAlchemyAutoSchema):
    product = ma.Nested(ProductSchema, many=False, only=("brand.name","category.name", "name", "description", "cover_image", "id",))

    class Meta:
        model = Inventory