### STAGE 1: Build ###
FROM node:current-alpine AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build --prod

### STAGE 2: Run ###

FROM httpd:2.4
COPY --from=build /usr/src/app/dist/covid-pwa-app /usr/local/apache2/htdocs/
COPY ./httpd-ssl.conf /usr/local/apache2/conf/extra/httpd-ssl.conf

RUN apt-get update && \
    apt-get install -y openssl && \
    openssl req -x509 -nodes -days 730 -newkey rsa:8192 -keyout /usr/local/apache2/conf/server.key -out /usr/local/apache2/conf/server.crt \
        -subj "/C=IT/ST=IT/L=IT/O=Covmatic/OU=IT/CN=example.com"

RUN sed -i \
        -e 's/^#\(Include .*httpd-ssl.conf\)/\1/' \
        -e 's/^#\(LoadModule .*mod_ssl.so\)/\1/' \
        -e 's/^#\(LoadModule .*mod_socache_shmcb.so\)/\1/' \
        -e 's/^#\(LoadModule .*mod_proxy.so\)/\1/' \
        -e 's/^#\(LoadModule .*mod_rewrite.so\)/\1/' \
        -e 's/^#\(LoadModule .*mod_proxy_http.so\)/\1/' \
        conf/httpd.conf

