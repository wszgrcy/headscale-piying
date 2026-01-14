FROM nginx:1.29.4-alpine AS builder
COPY dist /usr/share/nginx/html
