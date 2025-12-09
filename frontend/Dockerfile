FROM node:20-alpine

# Install dependencies for native modules
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy package files first for better caching
COPY package.json package-lock.json* ./

# Install all dependencies including devDependencies
RUN npm install --legacy-peer-deps

# Create a script to check and install missing deps at runtime
RUN echo '#!/bin/sh' > /usr/local/bin/start.sh && \
    echo 'if [ ! -d "/app/node_modules" ] || [ ! -f "/app/node_modules/.package-lock.json" ]; then' >> /usr/local/bin/start.sh && \
    echo '  echo "Installing dependencies..."' >> /usr/local/bin/start.sh && \
    echo '  npm install --legacy-peer-deps' >> /usr/local/bin/start.sh && \
    echo 'fi' >> /usr/local/bin/start.sh && \
    echo 'exec npm run dev -- --host 0.0.0.0' >> /usr/local/bin/start.sh && \
    chmod +x /usr/local/bin/start.sh

# Copy source files
COPY . .

EXPOSE 5173

# Use the startup script
CMD ["/bin/sh", "/usr/local/bin/start.sh"]
