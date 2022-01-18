FROM node:16 AS compiler
RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm build
RUN pnpx prisma generate


FROM node:16 AS builder
RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm
WORKDIR /app
COPY pnpm-lock.yaml package.json ./
RUN pnpm install --frozen-lockfile --prod


FROM node:16-bullseye-slim AS runner
ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=compiler "/app/node_modules/.pnpm/@prisma+client@3.7.0_prisma@3.7.0/node_modules/.prisma/client" "./node_modules/.pnpm/@prisma+client@3.7.0_prisma@3.7.0/node_modules/.prisma/client"
COPY --from=compiler /app/dist/server.js ./dist/server.js
CMD ["./dist/server.js"]
