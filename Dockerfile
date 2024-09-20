# First stage: Build the application
FROM node:20-alpine AS web-builder

# Set the working directory in the container
WORKDIR /home/node

# Install Yarn
RUN npm install -g yarn --force

# Switch to the application user for Node.js to improve security
USER node

# Copy the yarn.lock and package.json
COPY --chown=node:node .yarn /home/node/.yarn
COPY --chown=node:node .yarnrc.yml package.json yarn.lock /home/node/

# Install Node.js dependencies based on package.json
RUN yarn install

# Copy the entire application source code to the working directory
COPY --chown=node:node . /home/node/

# Build the application. This will create production-ready static files
RUN yarn build

# Second stage: Serve the application
FROM node:20-alpine

# Set the working directory in the container for the runtime image
WORKDIR /home/node

# Switch to the application user for Node.js to improve security
USER node

# Copy the built application and necessary files from the build stage
COPY --from=web-builder /home/node/.next /home/node/.next
COPY --from=web-builder /home/node/public /home/node/public
COPY --from=web-builder /home/node/node_modules /home/node/node_modules
COPY --from=web-builder /home/node/package.json /home/node/

# Expose port 3000 to allow traffic to the application
EXPOSE 3000

# Command to start the Next.js application
CMD ["npm", "start"]
