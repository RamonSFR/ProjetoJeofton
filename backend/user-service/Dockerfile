FROM node:22-alpine
WORKDIR /app
ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/prisma_build"
COPY package.json package-lock.json* ./
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npm install
COPY tsconfig.json ./
COPY src ./src
RUN npx prisma generate && npm run build
EXPOSE 3001
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
