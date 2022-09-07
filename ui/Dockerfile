# build stage
FROM node:14.17.4
RUN apt-get update || : && apt-get install python3 -y
WORKDIR /app
COPY package*.json ./
RUN npm install 
COPY . .
COPY .env.docker .env

# RUN npm run-script test:unit

# RUN npm run build
EXPOSE 8080
CMD npm run serve