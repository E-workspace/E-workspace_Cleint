# Use the official Node.js image as the base
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the app
RUN npm run build

# Specify the command to run the app
CMD ["npm", "start"]

# Expose the port React runs on (typically 3000 in development)
EXPOSE 3000
