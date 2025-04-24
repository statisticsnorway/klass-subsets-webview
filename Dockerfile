FROM nginx:1.28.0-alpine
RUN apk upgrade --no-cache
COPY src /usr/share/nginx/html
