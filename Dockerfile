FROM nginx:1.26.2-alpine
RUN apk upgrade --no-cache
COPY src /usr/share/nginx/html
