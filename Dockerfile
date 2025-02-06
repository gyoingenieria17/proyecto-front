# Etapa 1: Construcción de la aplicación Angular
FROM node:20-alpine3.21 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install

FROM node:20-alpine3.21 AS builder
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM nginx:1.21.3-alpine as prod
EXPOSE 80
COPY --from=builder /app/dist/proyecto-front /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

CMD [ "nginx", "-g", "daemon off;" ]
