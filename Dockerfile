FROM nginx:1.23.3-alpine
RUN apk upgrade --no-cache
COPY src /usr/share/nginx/html
