# build stage
FROM node:14.17.4 as build-stage
RUN apt-get update || : && apt-get install python3 -y
WORKDIR /app
COPY package*.json ./
RUN npm install 
COPY . .

# RUN npm run-script test:unit

RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html/digital-standards-self-assessment
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]