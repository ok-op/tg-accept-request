# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application files
COPY . .

# Expose the port the app runs on (optional, only needed if running locally)
EXPOSE 3000

USER 10014

# Define environment variable (optional, but if you want to pass vars in Docker)
ENV NODE_ENV production

# Run the app
CMD [ "npm", "start" ]
