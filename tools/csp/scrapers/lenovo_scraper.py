from ..base_scraper import BaseScraper

class LenovoScraper(BaseScraper):
    def __init__(self, url, download_content=True):
        super().__init__(url, download_content)
        self.register_url("www.lenovo.com")

    def get_title(self):
        return self.content.find("h2", {"class": "product_summary"}).text

    def get_description(self):
        container = self.content.find("div", {"class": "overview_container"})
        try: 
            overview_text = container.find("div", {"class": "rt-1-375"})
            return overview_text.text
        except AttributeError:
            return None

    def get_attributes(self):
        container = self.content.find("div", {"class": "specs-inner"})
        table = container.find("table")
        rows = table.find_all("tr")
        arr = {}
        for row in rows:
            #th and td
            name = row.find("th").text
            data = row.find("td").text
            arr[name] = data
        return arr

    def get_images(self):
        container = self.content.find_all("div", {"class": "image-pic"})
        list = []
        for img in container:
            #print(self._validate_url(img.find("img")["src"]))
            list.append(self._save_image(img.find("img")["alt"], self._validate_url(img.find("img")["src"])))
        return list