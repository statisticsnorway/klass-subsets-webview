FROM nginx:1.29.0-alpine
RUN apk upgrade --no-cache
COPY src /usr/share/nginx/html
