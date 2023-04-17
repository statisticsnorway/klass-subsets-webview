FROM nginx:1.24-alpine
RUN apk upgrade --no-cache
COPY src /usr/share/nginx/html
