# Étape 1 : Build de l'application Angular
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Étape 2 : Serveur Nginx pour servir l'application Angular
FROM nginx:alpine

# Copier la configuration personnalisée de Nginx
COPY ./default.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers de build Angular dans le répertoire de Nginx
COPY --from=build /app/dist/point-front/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
