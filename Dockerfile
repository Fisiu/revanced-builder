FROM node:lts-slim

WORKDIR /app

RUN apt-get --yes update && \
  apt-get --yes install git wget java-common libasound2 libxi6 libxtst6 xdg-utils procps && \
  wget --show-progress --progress=bar:force:noscroll -O /app/zulu.deb https://cdn.azul.com/zulu/bin/zulu17.44.15-ca-jdk17.0.8-linux_amd64.deb && \
  yes | dpkg -i /app/zulu.deb && \
  rm /app/zulu.deb && \
  apt-get -f install

RUN git clone --depth=1 --no-tags https://github.com/Fisiu/revanced-builder

WORKDIR /app/revanced-builder

RUN npm install --omit=dev

EXPOSE 8000

CMD ["node", ".", "--no-open"]
