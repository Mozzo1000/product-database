import requests
import sys

class API:
    def __init__(self, email, password, url="http://localhost:5000"):
        self.url = url
        # Login
        self.login_access = requests.post(url + "/v1/auth/login", json={"email": email, "password": password} )
        if self.login_access.status_code == 201:
            self.headers = {"Authorization": "Bearer " + self.login_access.json()["access_token"]}
        else:
            print(f"Unable to login. Status {self.login_access.status_code}")
            sys.exit(1)

    def add_product(self, name, description, brand_id, category_id):
        product = requests.post(self.url + "/v1/products", json={"name": name, 
                                                        "brand_id": brand_id,
                                                        "category_id": category_id,
                                                        "description": description}, headers=self.headers)
        return product.json()
    
    def add_attribute(self, product_id, name, value):
        attribute = requests.post(self.url + "/v1/attributes", json={"product_id": product_id,
                                                                        "name": name,
                                                                        "value": value}, headers=self.headers)
        return attribute.json()
    
    def add_document(self, image, product_id):
        data = {"file": (image, open(image, "rb")), "product_id": product_id}
        # send post request..
        document = requests.post(self.url + "/v1/documents", files=data, data=data, headers=self.headers)
        return document.json()
        
