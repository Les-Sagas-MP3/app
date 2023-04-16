FROM node:18-stretch as builder

ARG configuration

COPY package.json package-lock.json ./
RUN npm ci && mkdir /ng-app && mv ./node_modules ./ng-app
WORKDIR /ng-app
COPY . .
RUN npm i -g @ionic/cli@7 && ionic build --configuration $configuration

FROM nginx:1.23

ARG configuration

RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /ng-app/www /usr/share/nginx/html
CMD sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'
