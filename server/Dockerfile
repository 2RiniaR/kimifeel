FROM node:16
RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm
WORKDIR /app
COPY package.json ./pnpm-lock.yaml ./
COPY ./prisma/schema.prisma ./prisma/schema.prisma
RUN pnpm fetch --prod
RUN pnpm install -r --offline --prod
RUN pnpm add --global prisma
RUN pnpx prisma generate
COPY dist/server.js .
CMD ["node", "server.js"]
