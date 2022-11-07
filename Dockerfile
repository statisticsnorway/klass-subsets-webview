FROM nginx:1.23.2-alpine
RUN apk update
RUN apk upgrade --no-cache
COPY src /usr/share/nginx/html
