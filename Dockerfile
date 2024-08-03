# build environment
FROM node:18.15.0-alpine3.17 as build
WORKDIR /app
COPY . .
RUN apk add --update git python3 alpine-sdk
RUN npm install -g npm@9.1.3 pm2
RUN yarn install
RUN npm install ethers@5.7.2 --save --force
RUN npm run build

EXPOSE 3000

CMD ["pm2-runtime", "npm", "--", "start"]
