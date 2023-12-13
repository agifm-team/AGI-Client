## Builder
FROM node:20-alpine3.19 as builder

WORKDIR /src
RUN apk add yarn
COPY .npmrc package.json yarn.lock /src/
RUN yarn install --frozen-lockfile
COPY . /src/
ENV NODE_OPTIONS=--max_old_space_size=4096
RUN npm run build


## App
FROM nginx:alpine

COPY --from=builder /src/dist /usr/share/nginx/html

#RUN  ln -s /app /usr/share/nginx/html/app
