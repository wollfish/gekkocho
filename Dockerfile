# First stage: Build the application
FROM node:20-alpine AS web-builder

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

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
RUN corepack enable && yarn install

# Copy the entire application source code to the working directory
COPY --chown=node:node . /home/node/

# Build the application. This will create production-ready static files
RUN yarn build

# Second stage: Serve the application
FROM node:20-alpine

# Set the working directory in the container for the runtime image
WORKDIR /home/node

# Set production environment for better performance
ENV NODE_ENV=development
ENV PORT=6969
ENV HOSTNAME="0.0.0.0"

# Copy the built application and necessary files from the build stage
COPY --from=web-builder /home/node/.next/standalone ./
COPY --from=web-builder /home/node/.next/static ./.next/static
COPY --from=web-builder /home/node/public ./public

# Switch to the new application-specific user
USER node

# Expose port 3000 to allow traffic to the application
EXPOSE 6969

# Command to start the Next.js application
CMD ["node", "server.js"]
