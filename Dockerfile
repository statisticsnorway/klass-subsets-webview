FROM nginx:1.23.2-alpine
RUN apk update
RUN apk -u list
RUN apk upgrade
COPY src /usr/share/nginx/html
