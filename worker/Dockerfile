# This image serves the dependencies like tesseract@latest and OCRmyPDF@latest and the ocr worker for the nextcloud ocr app.
# important steps:
# docker build --build-arg LANGUAGES="tesseract-ocr-deu" -t <your username>/ocr .
# docker network create --driver bridge isolated_ocr
# docker run --name ocr --network=isolated_ocr -e "NODE_ENV=production" -e "REDIS_HOST=redis" -e "REDIS_DB=0" -e "REDIS_PORT=6379" -e "REDIS_PASSWORD=OCR" -v /path/to/data/directory/of/nextcloud:/home/node/data:ro -v /path/to/tmp:/home/node/output -d <your username>/ocr
#
FROM ubuntu:17.10

LABEL maintainer="janiskoehr@icloud.com" description="This image serves the dependencies like tesseract and OCRmyPDF and the ocr worker for the nextcloud ocr app." vendor="Janis Koehr"
ARG LANGUAGES="tesseract-ocr-fra tesseract-ocr-spa tesseract-ocr-deu"

# User
RUN groupadd --gid 1000 node \
    && useradd --uid 1000 --gid node --shell /bin/bash --create-home node

# Lang
ENV LC_ALL="C.UTF-8"
ENV LANG="C.UTF-8"

# Tesseract / languages
# For now leave tess4 because of bad performance RUN add-apt-repository ppa:alex-p/tesseract-ocr -y   && \
RUN apt-get update && apt-get install -y --no-install-recommends \
    tesseract-ocr \
    $LANGUAGES
    

# OcrMyPDF
RUN apt-get install -y --no-install-recommends \
    ocrmypdf

# Nodejs
RUN apt-get install lsb-release ca-certificates wget -y --no-install-recommends \
    && wget --quiet -O - https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add - \
    && echo "deb https://deb.nodesource.com/node_8.x $(lsb_release -s -c) main" | tee /etc/apt/sources.list.d/nodesource.list \
    && echo "deb-src https://deb.nodesource.com/node_8.x $(lsb_release -s -c) main" | tee -a /etc/apt/sources.list.d/nodesource.list

RUN apt-get update && apt-get install -y --no-install-recommends \
    nodejs

# Clean up
RUN rm -rf /tmp/* /var/tmp/* \
    && apt-get autoremove -y \
    && apt-get autoclean -y

# Create working directory and linked dirs for input and output
RUN mkdir -p /home/node/worker \
    && mkdir /home/node/data \
    && mkdir /home/node/output

# Workdir
WORKDIR /home/node/worker

# Bundle worker src
COPY . /home/node/worker

# Install worker dependencies
RUN npm install

# Build worker javascript files and delete src afterwards
RUN npm run build \
    && rm -r src/ package.json tsconfig.app.json tsconfig.json

USER node

CMD ["node","/home/node/worker/dist/main.js"]
