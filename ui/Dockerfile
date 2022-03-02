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
# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy nginx server confs
# COPY nginx/default.conf /etc/nginx/conf.d/default.conf
# COPY nginx/nginx.conf /etc/nginx/nginx.conf

# From 'build-stage' copy build output to default nginx public folder
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]