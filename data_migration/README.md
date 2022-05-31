<p align="center">
migrate-mongo is a database migration tool for MongoDB running in Node.js 
</p>
    
## Installation
````bash
$ npm install -g migrate-mongo
````

## CLI Usage

```
$ migrate-mongo
Usage: migrate-mongo [options] [command]


  Commands:

    init                  initialize a new migration project
    create [description]  create a new database migration with the provided description
    up [options]          run all unapplied database migrations
    down [options]        undo the last applied database migration
    status [options]      print the changelog of the database

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
```

## Basic Usage

### Initialize a new project

Make sure you have [Node.js](https://nodejs.org/en/) 10 (or higher) installed.

Create a directory where you want to store your migrations for your mongo database (eg. 'albums' here) and cd into it

```bash
$ mkdir albums-migrations
$ cd albums-migrations
```

Initialize a new migrate-mongo project

```bash
$ migrate-mongo init
Initialization successful. Please edit the generated migrate-mongo-config.js file
```

The above command did two things:

1. create a sample 'migrate-mongo-config.js' file and
2. create a 'migrations' directory

Edit the migrate-mongo-config.js file. An object or promise can be returned. Make sure you change the mongodb url:

```javascript
// In this file you can configure migrate-mongo

module.exports = {
  mongodb: {
    // TODO Change (or review) the url to your MongoDB:
    url: 'mongodb://localhost:27017',

    // TODO Change this to your database name:
    databaseName: 'YOURDATABASENAME',

    options: {
      useNewUrlParser: true, // removes a deprecation warning when connecting
      //   connectTimeoutMS: 3600000, // increase connection timeout to 1 hour
      //   socketTimeoutMS: 3600000, // increase socket timeout to 1 hour
    },
  },

  // The migrations dir, can be an relative or absolute path. Only edit this when really necessary.
  migrationsDir: 'migrations',

  // The mongodb collection where the applied changes are stored. Only edit this when really necessary.
  changelogCollectionName: 'changelog',

  // The file extension to create migrations and search for in migration dir
  migrationFileExtension: '.js',

  // Enable the algorithm to create a checksum of the file contents and use that in the comparison to determin
  // if the file should be run.  Requires that scripts are coded to be run multiple times.
  useFileHash: false,
};
```

Alternatively, you can also encode your database name in the url (and leave out the `databaseName` property):

```
        url: "mongodb://localhost:27017/YOURDATABASE",
```

### Creating a new migration script

To create a new database migration script, just run the `migrate-mongo create [description]` command.

For example:

```bash
$ migrate-mongo create blacklist_the_beatles
Created: migrations/20160608155948-blacklist_the_beatles.js
```

A new migration file is created in the 'migrations' directory:

```javascript
module.exports = {
  up(db, client) {
    // TODO write your migration here. Return a Promise (and/or use async & await).
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    // return db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
  },

  down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // return db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
```

Edit this content so it actually performs changes to your database. Don't forget to write the down part as well.
The `db` object contains [the official MongoDB db object](https://www.npmjs.com/package/mongodb)
The `client` object is a [MongoClient](https://mongodb.github.io/node-mongodb-native/3.3/api/MongoClient.html) instance (which you can omit if you don't use it).

There are 3 options to implement the `up` and `down` functions of your migration:

1. Return a Promises
2. Use async-await
3. Call a callback (DEPRECATED!)

Always make sure the implementation matches the function signature:

- `function up(db, client) { /* */ }` should return `Promise`
- `function async up(db, client) { /* */ }` should contain `await` keyword(s) and return `Promise`
- `function up(db, client, next) { /* */ }` should callback `next`

#### Example 1: Return a Promise

```javascript
module.exports = {
  up(db) {
    return db.collection('albums').updateOne({ artist: 'The Beatles' }, { $set: { blacklisted: true } });
  },

  down(db) {
    return db.collection('albums').updateOne({ artist: 'The Beatles' }, { $set: { blacklisted: false } });
  },
};
```

#### Example 2: Use async & await

Async & await is especially useful if you want to perform multiple operations against your MongoDB in one migration.

```javascript
module.exports = {
  async up(db) {
    await db.collection('albums').updateOne({ artist: 'The Beatles' }, { $set: { blacklisted: true } });
    await db.collection('albums').updateOne({ artist: 'The Doors' }, { $set: { stars: 5 } });
  },

  async down(db) {
    await db.collection('albums').updateOne({ artist: 'The Doors' }, { $set: { stars: 0 } });
    await db.collection('albums').updateOne({ artist: 'The Beatles' }, { $set: { blacklisted: false } });
  },
};
```

#### Example 3: Call a callback (deprecated)

Callbacks are supported for backwards compatibility.
New migration scripts should be written using Promises and/or async & await. It's easier to read and write.

```javascript
module.exports = {
  up(db, callback) {
    return db.collection('albums').updateOne({ artist: 'The Beatles' }, { $set: { blacklisted: true } }, callback);
  },

  down(db, callback) {
    return db.collection('albums').updateOne({ artist: 'The Beatles' }, { $set: { blacklisted: false } }, callback);
  },
};
```

#### Overriding the sample migration

To override the content of the sample migration that will be created by the `create` command,
create a file **`sample-migration.js`** in the migrations directory.

### Checking the status of the migrations

At any time, you can check which migrations are applied (or not)

```bash
$ migrate-mongo status
┌─────────────────────────────────────────┬────────────┐
│ Filename                                │ Applied At │
├─────────────────────────────────────────┼────────────┤
│ 20160608155948-blacklist_the_beatles.js │ PENDING    │
└─────────────────────────────────────────┴────────────┘

```

### Migrate up

This command will apply all pending migrations

```bash
$ migrate-mongo up
MIGRATED UP: 20160608155948-blacklist_the_beatles.js
```

If an an error occurred, it will stop and won't continue with the rest of the pending migrations

If we check the status again, we can see the last migration was successfully applied:

```bash
$ migrate-mongo status
┌─────────────────────────────────────────┬──────────────────────────┐
│ Filename                                │ Applied At               │
├─────────────────────────────────────────┼──────────────────────────┤
│ 20160608155948-blacklist_the_beatles.js │ 2016-06-08T20:13:30.415Z │
└─────────────────────────────────────────┴──────────────────────────┘
```

### Migrate down

With this command, migrate-mongo will revert (only) the last applied migration

```bash
$ migrate-mongo down
MIGRATED DOWN: 20160608155948-blacklist_the_beatles.js
```

If we check the status again, we see that the reverted migration is pending again:

```bash
$ migrate-mongo status
┌─────────────────────────────────────────┬────────────┐
│ Filename                                │ Applied At │
├─────────────────────────────────────────┼────────────┤
│ 20160608155948-blacklist_the_beatles.js │ PENDING    │
└─────────────────────────────────────────┴────────────┘
```
