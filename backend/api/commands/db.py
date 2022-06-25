from unicodedata import category
from flask import Blueprint
from models import db, Brand, Category, Product
from flask_migrate import Migrate
from alembic import command

db_command = Blueprint('data', __name__)

@db_command.cli.command("reset")
def reset():
    print("Resetting database!\nThis will delete everything!")
    ans = input("Are you sure? (y/n) : ")
    if ans == "y" or ans == "yes":
        print("Removing all tables..")
        db.drop_all()
        print("Creating tables..")
        db.create_all()
        config = Migrate(db_command, db).get_config()
        command.upgrade(config, "head")
        print("Done resetting database.")


@db_command.cli.command("seed")
def seed():
    # Seeding expects a clean database for every table it touches, like product, category and brands.

    brand_seeds = ["Dell", "Lenovo", "Acer", "HP"]
    category_seeds = ["Monitor", "Webcam", "Desktop", "Laptop"]
    products_seeds = {
        1: {"name": "Ultrasharp U2722H", "brand_id": 1, "category_id": 1, "description": "This is a monitor"},
        2: {"name": "ThinkVision T27i-10 27 inch Wide Full HD Monitor", "brand_id": 2, "category_id": 1, "description": "The 27” Lenovo™ ThinkVision® T27i-10 is a high-performance monitor that offers long term productivity for intense data and graphic applications. The NearEdgeless full-HD display makes easy connection to multiple displays with seamless visual clarity. The ThinkVision® T27i-10 comes with an array of ports including four USB 3.0 ports, VGA, DP and HDMI to boost your productivity. The ergonomic stand is compatible with ThinkCentre® Tiny and the sound bar, enabling you to utilize the T27i-10 to the fullest. Eye Comfort certification by TÜV ensures these displays are easy on the eyes, giving you the comfort you need."}
        }

    print("Starting database seed")
    print("Seeding brands..")
    for i in brand_seeds:
        new_brand = Brand(name=i)
        try:
            new_brand.save_to_db()
            print(f"Successfully added brand {i} to database.")
        except:
            print("Error occurred when adding brand {i} to database")
    
    print("Seeding category..")
    for i in category_seeds:
        new_category = Category(name=i)
        try:
            new_category.save_to_db()
            print(f"Successfully added category {i} to database.")
        except:
            print("Error occurred when adding category {i} to database")
    
    print("Seeding products..")
    for i in products_seeds:
        new_product = Product(name=products_seeds[i]["name"],
                            brand_id=products_seeds[i]["brand_id"],
                            category_id=products_seeds[i]["category_id"],
                            description=products_seeds[i]["description"])
        try:
            new_product.save_to_db()
            print(f"Successfully added product {products_seeds[i]['name']} to database.")
        except:
            print(f"Error occurred when adding product {products_seeds[i]['name']} to database")