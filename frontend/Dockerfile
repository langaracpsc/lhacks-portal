# Use the official Node.js image as a base
FROM node:21-alpine

# Set the working directory
# WORKDIR /usr/src/app

ENV NODE_PATH=/src

# Copy package.json and yarn.lock first to leverage Docker cache
COPY package.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn install --immutable --network-timeout 1000000

# Copy the rest of the application code
COPY . .

# Build the app using Yarn
RUN yarn build

# Expose the port the app runs on
EXPOSE 3000

# Specify the command to run the app
CMD ["yarn", "start"]