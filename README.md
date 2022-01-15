## Description

Project build as a example, this is based on [Nest](https://github.com/nestjs/nest) framework, 
Please make sure to check the following steps and information to run the project locally without issues 

## Dependencies
Mongodb 4.2 \
Node version v14.18.0

## Installation and configuration

###### Database configuration
Create a database in local enviroment with the following data
* DB name: **test**
* Create a user for database
  * username: **test**
  * password: **test**
  * role: **dbOwner**            

Install npm dependencies 
```bash
$ npm install
```
###### Environment
Create .env file on project root with the following data:

| Variable | Dev value | Description
| :---: | :---: | :---: |
| DB_CONNECTION | mongodb://test:test@localhost/test | Mongodb string connection |
| EXTERNAL_PRODUCT_API | https://61cc0fd9198df60017aebe51.mockapi.io | External api to get product mock data |
| TOKEN | someToken | Token to check on headers requests to api usage |

## Running the app
```bash
# development
$ npm run start
# watch mode
$ npm run start:dev
```

## Test
```bash
# unit tests
$ npm run test
# test coverage (considered for controller and services)
$ npm run test:cov
```

About used practices
1. For logging, I implemented a middleware that write on a logs.txt file on root module (it's not necessary to create it manually)
2. Check modules schemas to see properties to map in database
3. There is an external http call in src/implementation/implementation.service.ts make sure to set the EXTERNAL_PRODUCT_API env var to correct usage
4. all endpoints (except /health) use a middleware with a token, make sure headers uses a "token" property with TOKEN env var
5. For cache, I used a nest implementation in memory, the packae is cache-manager

## Author
Carlos García, Senior Software Engineer.  
