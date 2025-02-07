FROM nginx:1.27.4-alpine
RUN apk upgrade --no-cache
COPY src /usr/share/nginx/html
