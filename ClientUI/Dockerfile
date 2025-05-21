# Use official Node image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package.json yarn.lock tsconfig.json vite.config.ts ./

RUN yarn install --frozen-lockfile

COPY . .

# Expose port 3000 for Vite dev server
EXPOSE 3000

# Start the Vite development server
CMD ["yarn", "dev"]