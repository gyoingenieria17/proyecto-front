# Etapa 1: Construcción de la aplicación Angular
FROM node:20-alpine3.21 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install

FROM node:20-alpine3.21 AS builder
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY . .

# Construir la aplicación con el baseHref correcto
RUN npm run build -- --base-href /proyecto-front/ --deploy-url /proyecto-front/

# Etapa 2: Configuración de Nginx para servir la aplicación
FROM nginx:1.21.3-alpine AS prod
EXPOSE 8080

# Copiar los archivos compilados
COPY --from=builder /app/dist/proyecto-front/browser /usr/share/nginx/html/proyecto-front

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
