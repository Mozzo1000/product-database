import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse
import os

class BaseScraper:
    def __init__(self, url, download_content=True):
        self.url = url
        self.registered_url = None
        self.headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.84 Safari/537.36'}
        if download_content:
            page = requests.get(self.url, headers=self.headers)
            self.content = BeautifulSoup(page.content, "html.parser")

    def register_url(self, url):
        self.registered_url = url

    def get_hostname(self):
        return urlparse(self.url, "https").hostname

    def _save_image(self, name, image_url):
        if not os.path.exists("images"):
            os.makedirs("images")
        img_data = requests.get(self._validate_url(image_url)).content
        with open(os.path.join("images", name), "wb") as handler:
            handler.write(img_data)
        return os.path.join("images", name)

    def _validate_url(self, url):
        url = urlparse(url, "https")
        return url.geturl()

    def get_title(self):
        return None

    def get_description(self):
        return None
    
    def get_images(self):
        return None
    
    def get_attributes(self):
        return None