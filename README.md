# Digital Standard Self-Assessment Tool

## Clone the source code to your computer

Open a command line terminal window. then clone the code to your computer

```
$ git clone https://github.com/canada-ca/digital-standards-self-assessment.git
```

## Data initialization
- go to data_migration folder
```
$ cd digital-standard-self-assessment/data_migration
```

- Install migrate-mongo globally if you don’t have it installed.
```
$ npm install -g migrate-mongo
```

- Set database connection in migrate-mongo-config.js
- Initialize data. Run the following command.  It will create records of the survey and the team collections.
```
$ migrate-mongo up
```

- Rollback data migration (if you want to roll back the date change in step 5.
```
$ migrate-mongo down
```

- Go to your database to check if you have a record in survey collection, and a few records of team collection.

## Backend API
- Open digital-standard-self-assessment/api folder in Visual Studio Code.
- Press View -> Terminal to open a terminal window in VS Code.
- Run npm install
- Run npm start.  The API local server will start up with URL [http://localhost:7071/api/](http://localhost:7071/api/)
- Use Postman to test “Find latest survey”, the API will response a survey json file with HttpStatus 200.

## Frontend UI
- Open /digital-standard-self-assessment/api folder in Visual Studio Code.
- Press View -> Terminal to open a terminal window in VS Code.
- Run npm install
- Double check if the API URL is right in .env file
VUE_APP_API_BASE_URL=http://localhost:7071/api
- Run npm run serve
- Test the application in browser [http://localhost:8080/](http://localhost:8080/)

```test ```
