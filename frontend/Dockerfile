# Estágio 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Gera a pasta /dist
RUN npm run build

# Estágio 2: Produção (Nginx)
FROM nginx:stable-alpine
# Copia os arquivos estáticos do builder para o Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuração para evitar erro 404 em SPAs (React Router)
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]