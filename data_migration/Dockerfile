# build stage
FROM node as build-stage

COPY . /data_migration
COPY ./migrate-mongo-config.js.docker /data_migration/migrate-mongo-config.js
WORKDIR /data_migration

RUN apt-get update || : && \
    apt-get install python3 netcat -y && \
    npm install

CMD ./node_modules/.bin/migrate-mongo up
