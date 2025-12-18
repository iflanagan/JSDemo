# Use official Node.js image
FROM node:23

# Set working directory
WORKDIR /app

# Copy package.json first (for caching)
COPY package.json ./

# Install dependencies (if any)
RUN npm install

# Install live-server globally
RUN npm install -g live-server

# Copy ALL project files into the container
COPY . .

# Expose port 80
EXPOSE 80

# Run live-server on port 80
CMD ["live-server", "--port=80", "--host=0.0.0.0"]
