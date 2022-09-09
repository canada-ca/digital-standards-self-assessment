# Digital Standard Self-Assessment Tool

## Clone the source code to your computer

Open a command line terminal window. then clone the code to your computer

```
$ git clone https://github.com/canada-ca/digital-standards-self-assessment.git
```

## Data initialization

If you have the database in Azure cloud or in your local environment. You can initialize the data like this.

1. go to data_migration folder

```
$ cd digital-standard-self-assessment/data_migration
```

2. Install migrate-mongo globally if you don’t have it installed.

```
$ npm install -g migrate-mongo
```

3. Setup database connection in migrate-mongo-config.js
4. Initialize data. Run the following command. It will initialize the required data in database.

```
$ migrate-mongo up
```

5. Rollback data migration (if you want to roll back the date change in step 4.

```
$ migrate-mongo down
```

6. Go to your database to check if you have a database called 'dssa-db', then check if there are records the collections.

## Backend API

1. Open digital-standard-self-assessment/api folder in Visual Studio Code.
2. Press View -> Terminal to open a terminal window in VS Code.
3. Run npm install
4. Run npm start. The API local server will start up with URL [http://localhost:7071/api/](http://localhost:7071/api/)
5. Use Postman to test “Survey - Find latest”, the API will response a survey json file with HttpStatus 200.

## Frontend UI

1. Open /digital-standard-self-assessment/api folder in Visual Studio Code.
2. Press View -> Terminal to open a terminal window in VS Code.
3. Run npm install
4. Double check if the API URL is right in .env file
   VUE_APP_API_BASE_URL=http://localhost:7071/api
5. Run npm run serve
6. Test the application in browser [http://localhost:8080/](http://localhost:8080/)

## Run the application in Docker container

1. Open a command line terminal, and the project folder.
2. Run "docker-compose up -d" to start all services, which includes:
   - mongodb: Mongo database
   - mongo-express: A web based GUI management tool for mongodb
   - mongo-migrate: Data migration tool to initial/update data in mongodb
   - api: Backend Azure Function APIs
   - ui: Front end application run in a Nginx server, the Nginx server also plays a reverse proxy role for the banck end API.
3. Run "docker-compose up -d \<service name\>" to start an indivial service. The \<service name\> can be:
   - mongodb
   - mongo-express
   - mongo-migrate
   - api
   - ui.
4. Verify the application

   - Verify docker services. Run "docker ps", you should see these. The mongo-migrate service will run for a short time. So you won't see it in docker ps.
     |CONTAINER ID|IMAGE|COMMAND|CREATED|STATUS|PORTS|NAMES|
     |------------|-----|-------|-------|------|-----|-----|
     |3dab14698c39 |digital-standards-self-assessment_ui |"/docker-entrypoint.…" |45 minutes ago |Up 21 seconds |0.0.0.0:80->80/tcp |ui|
     |6cc79a54eea8 |digital-standards-self-assessment_api |"/azure-functions-ho…" |13 hours ago |Up 22 seconds |0.0.0.0:7071->80/tcp |api|
     |5d63ec9329ed |mongo-express:latest |"/bin/sh /wait-for.s…" |24 hours ago |Up 23 seconds |0.0.0.0:8081->8081/tcp |mongo-express|
     |c7d0b5c0bc08 |mongo:latest |"docker-entrypoint.s…" |24 hours ago |Up 24 seconds |0.0.0.0:27017->27017/tcp |mongodb|

   - Use mongo-express to verify database. Open http://localhost:8081/ to access mongo-express
   - Verify application. Open http://localhost/ to access the application
