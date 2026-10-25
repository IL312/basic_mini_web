FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci


COPY . .

ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

FROM nginx:1.30-alpine

RUN sed -i '/^user[[:space:]]*nginx;/s/^/# /' /etc/nginx/nginx.conf || true

RUN sed -i 's|^pid[[:space:]]*.*;|pid /tmp/nginx.pid;|' /etc/nginx/nginx.conf || true

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

RUN mkdir -p /var/cache/nginx && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /usr/share/nginx/html

USER nginx

ENTRYPOINT []

CMD ["nginx", "-g", "daemon off;"]

EXPOSE 8080