FROM node:20.12.0-slim
WORKDIR /app
COPY package*.json ./
RUN npm install -g npm@10.8.1
RUN npm config set cache /tmp/.npm-cache --global
RUN npm install --legacy-peer-deps
COPY . ./
ENV PORT 3000
EXPOSE 3000
CMD ["npm", "run", "dev"]
