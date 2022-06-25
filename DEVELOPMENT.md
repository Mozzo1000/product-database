# Development
This document is intended to get you started developing and contributing to `product-database` as quick as possible.

## Prerequisites
You will need to have the following installed on your computer:
* [Python 3](https://python.org/)
* [Docker](https://docker.com)

## Getting started
A few steps need to be taken before starting development on the front- and backend.

### Backend
The backend consists of two parts, the API which is a Flask server and a database running PostgreSQL.

#### API
From the `backend` folder run the following to install all python packages:
```
python -m pip install -r requirements.txt
```
##### Setup environment variables
Copy `.env.example` file and name it `.env`in the same folder. You do not need to change anything unless you want to or run into problems.

##### Create documents folder
Create a folder in the `backend` folder named `documents`. This is a folder where all uploaded files and images are stored.

##### Start API server
From the `backend` folder run the following to start the development API server:
```
python -m flask run
```

#### Database
From the `backend` folder run the following to retrieve the lastest docker images and setup the PostgreSQL database:
 ```
 docker-compose up
 ```
Once the database is up and running, run the following to add all necessary tables to the database:
```
python -m flask db upgrade
```

### Frontend
The frontend is a React website that communicates to the API to retrieve and send information.

From the `frontend` folder run the following to install:
```
npm install
```
#### Start the frontend server
From the `frontend` folder run the following to start the development frontend server:
```
npm start
```

## Create admin user
From the `backend` folder run the following command to create a new user:
```
python -m flask user create <email> <name> <role>
```
Role can be either `admin` or `user`. In this case you will want to use `admin`.

Example:
```
python -m flask user create admin@admin.com Admin admin
```

## (Optional) Seed database
If you want the database to be occupied with data for testing you can run the following command from inside the `backend` folder:
**Note: the database needs to be empty!**
```
python -m flask data seed
```

You should now be all good to go in order to start developing. If you have any questions or problems, feel free to get in contact by opening a issue.