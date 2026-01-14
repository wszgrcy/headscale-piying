FROM nginx:1.29.4-alpine AS builder
COPY dist /usr/share/nginx/html
COPY ./build/docker-asset/nginx /etc/nginx
