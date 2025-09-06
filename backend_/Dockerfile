FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install --production

# Copy the rest of the application source code
COPY . .

# Expose the port the server runs on
EXPOSE 5000

# Command to start the server
CMD ["node", "index.js"]