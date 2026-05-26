
FROM --platform=linux/arm64 openscad/openscad:dev

USER root

RUN apt-get update && apt-get install -y \
    curl \
    ca-certificates \
    xvfb \
    xauth \
    xfonts-base \
    file \
    procps \
    && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://deb.nodesource.com/setup_24.x | bash - && \
    apt-get update && apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN mkdir -p uploads output profiles scadFiles

RUN uname -m && \
    node --version && \
    npm --version && \
    openscad --version

CMD ["npx", "tsx", "worker.ts"]
