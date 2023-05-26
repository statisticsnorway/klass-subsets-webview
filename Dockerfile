FROM nginx:1-alpine
RUN apk upgrade --no-cache
COPY src /usr/share/nginx/html
