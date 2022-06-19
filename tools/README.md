# Internal tools
This folder contains tools that are used to help in deploying and running the `product-database` service.

## Common Scraper Platform (CSP)
CSP is the main way to write scrapers that automatically retrieve information from websites and adds them to the database. 
`cli.py` is the entry way for administrators to run a scraper, the tool automatically selects the best scraper for the link provided. 
### List of scrapers
* Lenovo