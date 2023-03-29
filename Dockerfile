FROM nginx:1.23.4-alpine
RUN apk upgrade --no-cache
COPY src /usr/share/nginx/html
