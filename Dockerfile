## Builder
FROM node:20-alpine3.19 as builder

WORKDIR /src
RUN apk add yarn git
COPY .npmrc package.json yarn.lock /src/
RUN yarn install --frozen-lockfile
#RUN yarn setup
COPY . /src/
ENV NODE_OPTIONS=--max_old_space_size=4096
RUN yarn build:dev


## App
FROM nginx:1.26.0-alpine

COPY --from=builder /src/dist /usr/share/nginx/html

#RUN  ln -s /app /usr/share/nginx/html/app
