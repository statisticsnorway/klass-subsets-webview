FROM nginx:1.25-alpine
RUN apk upgrade --no-cache
COPY src /usr/share/nginx/html
