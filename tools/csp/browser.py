from Screenshot import Screenshot_Clipping
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options
import os
from base64 import b64decode
import shutil
from datetime import datetime

class Browser:
    def __init__(self, url, tmp_path="tmp"):
        self.url = url
        self.tmp_path = tmp_path
        self.date = datetime.today().strftime('%Y-%m-%d')

        options = Options()

        options.headless = True
        self.driver = webdriver.Chrome(ChromeDriverManager().install(), options=options)
        self.driver.get(url)
        if not os.path.exists(self.tmp_path):
            os.makedirs(self.tmp_path)
        

    def save_screenshot(self):
        safe_url = str(self.url).replace("/", "-")
        ob=Screenshot_Clipping.Screenshot()
        img_url=ob.full_Screenshot(self.driver, save_path=self.tmp_path, image_name=f"{safe_url}-{self.date}.png")
        return img_url

    def save_pdf(self):
        safe_url = str(self.url).replace("/", "-")
        a = self.driver.execute_cdp_cmd(
            "Page.printToPDF", {"path": 'html-page.pdf', "format": 'A4'})
        b64 = a["data"]
        f = open(os.path.join(self.tmp_path, f"{safe_url}-{self.date}.pdf"), "wb")
        f.write(b64decode(b64, validate=True))
        f.close()
        return os.path.join(self.tmp_path, f"{safe_url}-{self.date}.pdf")


    def exit(self):
        self.driver.close()
        self.driver.quit()
        shutil.rmtree(self.tmp_path)