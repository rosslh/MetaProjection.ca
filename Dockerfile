FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY . /usr/share/nginx/html

RUN apk add --no-cache python3 \
    && cd /usr/share/nginx/html \
    && python3 build-symlinks.py \
    && rm -f build-symlinks.py Dockerfile nginx.conf .dockerignore
