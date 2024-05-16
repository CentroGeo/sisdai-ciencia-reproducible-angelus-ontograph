FROM node:14-alpine  as build
RUN yarn global add npm@8
WORKDIR /app
RUN npm install -g @vue/cli  --silent

COPY package.json ./
RUN npm install --silent

# Ideally, these files woudn't be in the git root, but we can work with that.
COPY *.json /app/
ADD src /app/src
ADD public /app/public
COPY *js /app/
COPY .env /app/
COPY .env.local /app/

WORKDIR /app
RUN npm run build



FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]