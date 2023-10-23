# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json from your host into the container at /app
COPY package.json /app/

# Install `git` to clone your repository
RUN apt-get update && apt-get install -y git

# Clone your app repository (replace with your Git repository URL)
RUN git clone https://github.com/iflanagan/JSDemo.git

# Install project dependencies (if using npm)
RUN npm install

# Install `live-server` globally
RUN npm install -g live-server

# Expose the port that live-server will use (default is 8080)
EXPOSE 8443

# Start your Node.js app server using `live-server`
CMD ["live-server"]

