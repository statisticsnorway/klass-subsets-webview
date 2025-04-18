FROM nginx:1.27.5-alpine
RUN apk upgrade --no-cache
COPY src /usr/share/nginx/html
