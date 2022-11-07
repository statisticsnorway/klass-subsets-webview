FROM nginx:1.23.2-alpine
RUN apk del curl
COPY src /usr/share/nginx/html
