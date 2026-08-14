FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY prisma ./prisma
COPY src ./src
COPY tsconfig.json ./
COPY tsconfig.build.json ./

RUN npx prisma generate

RUN npm run build


FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/generated ./src/generated
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["node", "dist/main.js"]

