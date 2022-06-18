import argparse

from outcome import capture
from csp.base_scraper import BaseScraper
from importlib import import_module
from inspect import isclass
from pkgutil import iter_modules
from pathlib import Path
import os
from urllib.parse import urlparse
from csp.api import API
from getpass import getpass
import shutil
import csv
from csp.browser import Browser
from tqdm import tqdm

def main():
    parser = argparse.ArgumentParser("Common Scraper Platform CLI")
    parser.add_argument("-u", "--url", type=str, help="Url to scrape")
    parser.add_argument("-f", "--file", type=str, help="File with urls to scrape")
    parser.add_argument("-b", "--brand", type=int, help="ID of brand to insert scraped content into")
    parser.add_argument("-c", "--category", type=int,  help="ID of category to insert scraped content into")

    api_group = parser.add_argument_group("API")
    api_group.add_argument("-a", "--api-url", type=str, default="http://localhost:5000", help="URL to api")
    api_group.add_argument("-e", "--email", type=str, help="Email for authenticating to api")
    api_group.add_argument("-p", "--password", type=str, help="Password for authenticating to api")
    
    print("Connecting to API...")
    if parser.parse_args().email:
        email_ans = parser.parse_args().email
    else:
        email_ans = input("Email: ")
    if parser.parse_args().password:
        password_ans = parser.parse_args().password
    else:
        password_ans = getpass()

    api = API(email_ans, password_ans, parser.parse_args().api_url)

    if parser.parse_args().brand:
        brand_id = parser.parse_args().brand
    else:
        print(f"\n{'ID':<8} {'Brand':<15}")
        for brand in api.get_brands():
            print(f"{brand['id']:<8} {brand['name']}")
        brand_id = input("Select brand ID: ")
    if parser.parse_args().category:
        category_id = parser.parse_args().category
    else:
        print(f"\n{'ID':<8} {'Category':<15}")
        for category in api.get_categories():
            print(f"{category['id']:<8} {category['name']}")
        category_id = input("Select category ID: ")

    if parser.parse_args().url:
        parse_url(parser, parser.parse_args().url, api, brand_id, category_id)
        
    elif parser.parse_args().file:
        with open(parser.parse_args().file, "r") as csvfile:
            for row in csv.reader(csvfile, delimiter=","):
                print(', '.join(row))
                parse_url(parser, ', '.join(row), api, brand_id, category_id)
    else:
        parser.print_help()

def parse_url(parser, url, api, brand_id, category_id):
    package_dir = os.path.join(Path(__file__).resolve().parent, "csp/scrapers")
    for (_, module_name, _) in iter_modules([package_dir]):
        module = import_module(f"csp.scrapers.{module_name}")
        for attribute_name in dir(module):
            attribute = getattr(module, attribute_name)
            if isclass(attribute) and issubclass(attribute, BaseScraper) and attribute.__name__ != "BaseScraper":
                if urlparse(url).hostname == attribute(url, download_content=False).registered_url:
                    print(f"\nUsing scraper: {attribute.__name__}")
                    print(f"URL: {url}\n")
                    scraper = attribute(url)
                    new_product = api.add_product(scraper.get_title(), scraper.get_description(), brand_id, category_id)
                    print(f"Added new product with name: {new_product['name']}\n")
                    num_of_attr = []
                    attr_pbar = tqdm(scraper.get_attributes().items())
                    for name, value in attr_pbar:
                        attr_pbar.set_description("Adding attributes")
                        new_attribute = api.add_attribute(new_product["id"], name, value)
                        num_of_attr.append(new_attribute)
                    print(f"Added {len(num_of_attr)} attributes to product {new_product['name']}\n")
                    
                    num_of_images = []
                    image_pbar = tqdm(scraper.get_images())
                    for i in image_pbar:
                        image_pbar.set_description("Adding images")
                        new_image = api.add_document(i, new_product["id"])
                        num_of_images.append(new_image)
                    print(f"Added {len(num_of_images)} images to product {new_product['name']}\n")

                    shutil.rmtree("images")

                    print("Starting browser...")
                    browser = Browser(url)
                    api.add_document(browser.save_pdf(), new_product["id"])
                    browser.exit()

                    print(f"\nAll done with {new_product['name']} : {url}")

if __name__ == "__main__":
    main()