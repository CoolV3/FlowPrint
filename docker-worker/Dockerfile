FROM --platform=linux/arm64 node:24-bookworm

RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    xvfb \
    file \
    procps \
    && rm -rf /var/lib/apt/lists/*

RUN wget -qO- https://files.openscad.org/OBS-Repository-Key.pub \
    | gpg --dearmor -o /usr/share/keyrings/obs-openscad-nightly.gpg

RUN echo "deb [signed-by=/usr/share/keyrings/obs-openscad-nightly.gpg] https://download.opensuse.org/repositories/home:/t-paul/Debian_12/ ./" \
    > /etc/apt/sources.list.d/openscad.list

RUN apt-get update && apt-get install -y \
    openscad-nightly \
    && rm -rf /var/lib/apt/lists/*

RUN ln -sf /usr/bin/openscad-nightly /usr/local/bin/openscad

# Debug direkt beim Build:
RUN uname -m && \
    dpkg --print-architecture && \
    file /usr/bin/openscad-nightly && \
    openscad --version

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN mkdir -p uploads output profiles scadFiles

CMD ["npx", "tsx", "worker.ts"]