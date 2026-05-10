FROM node:24-bookworm

RUN apt-get update && apt-get install -y \
    xvfb \
    flatpak \
    curl \
    dbus-x11 \
    && rm -rf /var/lib/apt/lists/*

# RUN flatpak remote-add --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo

# RUN curl -L -o /tmp/orcaslicer.flatpak https://github.com/OrcaSlicer/OrcaSlicer/releases/download/v2.3.2/OrcaSlicer-Linux-flatpak_V2.3.2_aarch64.flatpak \
  #   && flatpak install -y --noninteractive /tmp/orcaslicer.flatpak


WORKDIR /app

COPY package*.json ./
RUN npm install


COPY . .
RUN mkdir -p uploads output profiles

CMD ["npx", "tsx", "worker.ts"]
