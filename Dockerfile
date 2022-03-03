FROM alpine:3.14

RUN apk add --update --no-cache python3 py-pip nodejs npm
RUN pip install jinja2
WORKDIR /app
COPY init.js package.json /app/
COPY assets /app/assets
RUN npm install
ENTRYPOINT [ "node", "init.js" ]

