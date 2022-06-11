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

def main():
    parser = argparse.ArgumentParser("Common Scraper Platform CLI")
    parser.add_argument("-u", "--url", type=str, help="Url to scrape")
    parser.add_argument("-f", "--file", type=str, help="File with urls to scrape")

    api_group = parser.add_argument_group("API")
    api_group.add_argument("-a", "--api-url", type=str, default="http://localhost:5000", help="URL to api")
    api_group.add_argument("-e", "--email", type=str, help="Email for authenticating to api")
    api_group.add_argument("-p", "--password", type=str, help="Password for authenticating to api")
    
    
    if parser.parse_args().url:
        parse_url(parser, parser.parse_args().url)
        
    elif parser.parse_args().file:
        with open(parser.parse_args().file, "r") as csvfile:
            for row in csv.reader(csvfile, delimiter=","):
                print(', '.join(row))
                parse_url(parser, ', '.join(row))
    else:
        parser.print_help()

def parse_url(parser, url):
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
    
    package_dir = os.path.join(Path(__file__).resolve().parent, "csp/scrapers")
    for (_, module_name, _) in iter_modules([package_dir]):
        module = import_module(f"csp.scrapers.{module_name}")
        for attribute_name in dir(module):
            attribute = getattr(module, attribute_name)
            if isclass(attribute) and issubclass(attribute, BaseScraper) and attribute.__name__ != "BaseScraper":
                if urlparse(url).hostname == attribute(url, download_content=False).registered_url:
                    print(f"Using scraper: {attribute.__name__}")
                    scraper = attribute(url)
                    new_product = api.add_product(scraper.get_title(), scraper.get_description(), 1, 1)
                    for name, value in scraper.get_attributes().items():
                        new_attribute = api.add_attribute(new_product["id"], name, value)
                        print(new_attribute)
                    for i in scraper.get_images():
                        new_image = api.add_document(i, new_product["id"])
                        print(new_image)
                    shutil.rmtree("images")
                    browser = Browser(url)
                    api.add_document(browser.save_screenshot(), new_product["id"])
                    api.add_document(browser.save_pdf(), new_product["id"])
                    browser.exit()
    

if __name__ == "__main__":
    main()