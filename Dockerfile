# --------- package ---------
FROM node:18.16.1-slim AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build


# --------- final image build ---------
FROM nginx:latest

WORKDIR /usr/share/nginx/html/
COPY --from=builder /app/dist /usr/share/nginx/html/
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
