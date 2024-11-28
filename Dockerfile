FROM nginx:1.27.3-alpine
RUN apk upgrade --no-cache
COPY src /usr/share/nginx/html
