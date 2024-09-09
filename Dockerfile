FROM node:18.16.0-slim as builder

WORKDIR /usr/src/app/
USER root
COPY package.json ./
RUN npm install --only=production

COPY . .
RUN npm run build


FROM nginx:latest

WORKDIR /usr/share/nginx/html/

COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./default.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /usr/src/app/dist  /usr/share/nginx/html/

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
