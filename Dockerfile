# Use the official Node.js image
FROM node:14

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the port React runs on
EXPOSE 3001

# Start the React app
CMD ["npm", "start"]
