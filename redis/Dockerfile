# This image serves the redis instance for the ocr worker and the nextcloud ocr app.
# important steps:
# docker build --build-arg PASSWORD="<your custom very safe password>" -t <your username>/redis .
# docker run --name redis --network=isolated_ocr -p 6379:6379 -d <your username>/redis
# Please notice: since Redis is pretty fast an outside user can try up to
# 150k passwords per second against a good box. This means that you should
# use a very strong password otherwise it will be very easy to break.

FROM redis

LABEL maintainer="janiskoehr@icloud.com" description="This image serves the redis instance for the ocr worker and the nextcloud ocr app." vendor="Janis Koehr"
ARG PASSWORD="OCR"

COPY redis.conf /usr/local/etc/redis/redis.conf

RUN if [ -n "$PASSWORD" ]; then echo "requirepass $PASSWORD" >> /usr/local/etc/redis/redis.conf; fi

CMD [ "redis-server", "/usr/local/etc/redis/redis.conf" ]