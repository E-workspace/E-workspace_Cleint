# Use official Node.js image
FROM node:18

# App directory create pannudhu
WORKDIR /app

# Dependencies copy and install pannudhu
COPY package*.json ./
RUN npm install

# App source code copy pannudhu
COPY . .

# App run panna port expose pannudhu
EXPOSE 5000

# Start command
CMD ["node", "server.js"]