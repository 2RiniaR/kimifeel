FROM node:16-bullseye
RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm
WORKDIR /app
RUN pnpm install prisma
COPY ./prisma ./prisma
CMD ["pnpx", "prisma", "migrate", "deploy"]
