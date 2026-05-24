FROM node:20-alpine AS base

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV NODE_ENV=development
ENV PORT=3000
ENV POSTGRES_HOST=db
ENV POSTGRES_PORT=5432
ENV POSTGRES_DB=quiz_app
ENV POSTGRES_USER=quiz_user
ENV POSTGRES_PASSWORD=quiz_password
ENV DATABASE_URL=postgres://quiz_user:quiz_password@db:5432/quiz_app

EXPOSE 3000

CMD ["npm", "run", "dev"]
