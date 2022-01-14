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
        query = Document.query.filter(Document.product_id==obj.id, Document.type.contains("image/")).first()
        return query.name

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