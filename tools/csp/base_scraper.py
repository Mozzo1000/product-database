import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse
import os
import string

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
        if not name:
            name = self._validate_url(image_url).split("/")[-1]
        filename, file_extension = os.path.splitext(os.path.join("images", self._clean_filename(name)))
        
        if not file_extension:
            file_extension = ".jpg"
        with open(filename + file_extension, "wb") as handler:
            handler.write(img_data)
        return filename + file_extension

    def _validate_url(self, url):
        url = urlparse(url, "https")
        return url.geturl()
    
    def _clean_filename(self, s):
        # https://gist.github.com/seanh/93666    
        valid_chars = "-_.() %s%s" % (string.ascii_letters, string.digits)
        filename = ''.join(c for c in s if c in valid_chars)
        filename = filename.replace(' ','_') # I don't like spaces in filenames.
        return filename

    def get_title(self):
        return None

    def get_description(self):
        return None
    
    def get_images(self):
        return None
    
    def get_attributes(self):
        return None