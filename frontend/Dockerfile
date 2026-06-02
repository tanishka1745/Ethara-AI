FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps --omit=dev 2>/dev/null || npm install --legacy-peer-deps
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
