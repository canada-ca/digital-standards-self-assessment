# build stage
FROM node:14.17.4 as build-stage
RUN apt-get update || : && apt-get install python3 netcat -y
WORKDIR /data_migration
COPY . .

CMD npx migrate-mongo

