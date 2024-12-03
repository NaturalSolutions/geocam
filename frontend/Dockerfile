# 1. Install dependencies only when needed
FROM node:lts-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat 

WORKDIR /app
COPY package*.json ./
RUN npm install

# 2. Rebuild the source code only when needed
FROM node:lts-alpine AS development

RUN apk add --no-cache curl

RUN mkdir -p /app && chown node:node /app

WORKDIR /app
USER node

COPY --chown=node:node --from=deps /app/node_modules ./node_modules
COPY --chown=node:node . .

ARG REACT_APP_KEYCLOAK_CLIENT_URL
ARG REACT_APP_KEYCLOAK_CLIENT_REALM
ARG REACT_APP_KEYCLOAK_CLIENT_CLIENT_ID
ARG REACT_APP_API_PATH


RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]

# 3. Production image, copy all the files and run next
FROM nginx:1.23.2-alpine AS production

COPY --chown=nginx:nginx --from=development /app/build/ /usr/share/nginx/html

WORKDIR /usr/share/nginx/html/
COPY ./window_env.sh .
RUN chmod +x window_env.sh

RUN echo -e '\
    server { \n\
    listen 80; \n\
    location / { \n\
    root /usr/share/nginx/html; \n\
    index index.html index.htm; \n\
    try_files $uri $uri/ /index.html; \n\
    } \n\
    error_page 500 502 503 504 /50x.html; \n\
    location = /50x.html { \n\
    root /usr/share/nginx/html; \n\
    } \n\
    } \n\
    ' > /etc/nginx/conf.d/default.conf

CMD ["/bin/sh", "-c", "/usr/share/nginx/html/window_env.sh && nginx -g \"daemon off;\""]