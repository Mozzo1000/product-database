from enum import unique
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

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
    class Meta:
        model = Product

class Document(db.Model):
    __tablename__ = "document"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True)
    type = db.Column(db.String, nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'))
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

class DocumentSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Document
