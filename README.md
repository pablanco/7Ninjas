# 7NinjasTest

Repository of the test demo app developed for 7Ninjas

## Stack selection

All web services were developed with node.js, database is implemented with redis to improve request performance.
Frontend has angular material design.

## Run Requirements

Before running the app you should install [Redis](https://redis.io/download) and [Node](https://nodejs.org/en/download/)


## Run the app

Open a console and go to the project root path.

### 1. Client

Execute

`npm install` install packages
`ng serve` runs frontend 

Frontend app should be available at [http://localhost:4200/](http://localhost:4200/)

### 2. Server

Execute

`gulp` compiles server js files
`node dist/app.server.js` runs the server

Server should be running at [http://localhost:3000/](http://localhost:3000/)

### Tests

I have implemented some E2E test, testing front and back ends. (To run the tests you should previously clear all redis data executing: redis-cli FLUSHALL and run the server (2) )
 
Execute

`protractor protractor.conf.js` runs WebDriver and tests under /test folder

## Routes

User login      - http://localhost:4200/login/
Planet search   - http://localhost:4200/planet
Planet list     - http://localhost:4200/planets
Planet comments - http://localhost:4200/comment/Felucia


