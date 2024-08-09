FROM node:20-bullseye AS builder

ARG anilist_client_id
ARG anilist_redirect_uri

WORKDIR /app

COPY . .

ENV VITE_ANILIST_CLIENT_ID=$anilist_client_id
ENV VITE_ANILIST_REDIRECT_URI=$anilist_redirect_uri

RUN ulimit -S 1024
RUN npm --force i

RUN npm run build

FROM nginx:alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=builder /app/dist .

RUN rm /etc/nginx/conf.d/default.conf

COPY ./nginx/nginx.conf /etc/nginx/conf.d

ENTRYPOINT ["nginx", "-g", "daemon off;"]