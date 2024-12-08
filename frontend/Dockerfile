FROM node:22.11.0-bullseye

# Create and set the working directory
WORKDIR /app

# Copy dependency definition files first
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Expose the application port
EXPOSE 3000
