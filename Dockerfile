FROM node:22-alpine AS builder

WORKDIR /usr/src/app

COPY package.json tsconfig.json ./
COPY src ./src

RUN npm install && npm run build

FROM node:22-alpine AS runtime

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY package.json ./
RUN npm install --only=production

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 4005

CMD ["node", "dist/index.js"]


