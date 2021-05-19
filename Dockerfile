# We use debian as our base distro for this container.
FROM debian:jessie

# Refresh apt-get.
RUN apt-get update

# Install some utilities needed by node, npm.
RUN apt-get install -y curl make g++

# Install Node.js and npm.
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install -y nodejs --force-yes

# Install required npm packages.

ADD package.json /package.json
RUN npm install
WORKDIR /src

EXPOSE  8085

# Run startup command.
CMD ["node", "/src/index.js"]