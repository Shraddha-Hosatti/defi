# HireWheels

Hirewheels backend application for booking and managing rides.

Type of Users :

* Admin
	* Add Vehicle
	* Change Vehicle Availability
* User
	* View Available Rides
	* Book Rides

## Prerequisites

**Supported OS :** Ubuntu 18.04 LTS

### Node and pm2

Below are the commands to install Node and pm2 :

```
curl -sL https://deb.nodesource.com/setup_12.x -o nodesource_setup.sh
sudo bash nodesource_setup.sh
sudo apt install nodejs
sudo npm install pm2 -g
```

**Note :** pm2 can be used in production for running the backend.

### MongoDB

Below are the commands to install latest mongodb in your local system.

```
sudo apt update
sudo apt install gnupg
wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -

echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list

sudo apt update
sudo apt install -y mongodb-org

sudo systemctl enable --now mongod

systemctl status mongod

```

## Project Configuration

Project Configurations are stored in below paths :

* config/development.js
* config/staging.js
* config/production.js

Current configuration is determined in config/config.js file.
### JWT keys

**Important :** This step is required only if you want to change jwt keys in ur system

JWT keys can be generated via below commands

```
openssl ecparam -genkey -name prime256v1 -noout -out ec_private.pem
openssl ec -in ec_private.pem -pubout -out ec_public.pem
```

It will create a new public and private key file, copy the content and paste it in configuration


### Create User on Mongo

Create a new user(as per config) in Mongo for ur hirewheels application.

Connect to mongo(shell/UI) and run below commands

```
use hirewheels;

db.createUser(
  {
    user: "user1",
    pwd: "password1",
    roles: [
       { role: "readWrite", db: "hirewheels" }
    ]
  }
)
```

## API

### Documentation

https://documenter.getpostman.com/view/5716890/T1Dv9FUC?version=latest

### Install dependency

`sudo npm i`

### Create Log Folders (Optional)

You can skip this step if you dont want to do file logging. File logging is disabled by default in configuration(config.logs.fileLogs).

Replace paths as per your configuration.

```
sudo mkdir -p /var/log/hirewheels
sudo chmod -R 777 /var/log/hirewheels
```
### Set Enviornment

Application will run as per the config in config/config.js. Config can be managed via either code or enviornment variable which you can change as per below steps.

To set it temporary

`export HW_ENV="staging"`

To set it permanent add HW_ENV=staging in /etc/environment

`sudo -H vi /etc/environment`

Test Env variable

`echo $HW_ENV`

### Create Collection and Indexes

Below commands will run in node terminal to create Collections and Indexes in mongo"

```
node
const MongoDB = require('./db/mongo')
MongoDB.connectDB()
MongoDB.createCollections()
MongoDB.createIndexes()
```

### DB Schema

https://docs.google.com/spreadsheets/d/1UCFU9chdDwkknfJXDibMp-lqDLyw0RytgtcbSxYqV4s/edit
### Add Init Data

Run below script to add initial data in your database

`node script/initData.js`

**Important :** Get Frontend hardcoded values from its result.

The following link contains information about the tables which will be pre-populated by it

https://docs.google.com/document/d/15dMhSPcWLzT29eQyOsNLL9IjEOhhiQBzsrDiBlNE254/edit?usp=sharing

### Start Project

Locally

`npm run start`

Production

`pm2 start npm --name "hirewheels_backend" --log-date-format 'DD-MM HH:mm:ss.SSS' -- start`

### Test Cases

Run Below command to run all the test cases

`npm run test`
