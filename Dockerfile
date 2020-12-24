FROM node:lts-slim as build

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY yarn.lock /app/yarn.lock
COPY package.json /app/package.json

RUN yarn --network-timeout 100000

RUN echo "building..."
COPY . /app
RUN yarn run build

FROM nginx:1.16.0-alpine
COPY --from=build /app/build /usr/share/nginx/html
ADD nginx/nginx.conf /etc/nginx/conf.d/default.template
CMD sh -c "envsubst \"`env | awk -F = '{printf \" \\\\$%s\", $1}'`\" < /etc/nginx/conf.d/default.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"