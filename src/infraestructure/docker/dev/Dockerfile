FROM [REGISTRY]/[IMAGE]:TAG

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY . .

CMD [ "yarn", "start:docker" ]
