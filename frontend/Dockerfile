FROM node:17

ARG anilist_client_id
ARG anilist_redirect_uri

WORKDIR /app

COPY . .

ENV VITE_ANILIST_CLIENT_ID=$anilist_client_id
ENV VITE_ANILIST_REDIRECT_URI=$anilist_redirect_uri

RUN npm i

CMD ["npm", "run", "build"]