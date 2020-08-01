FROM hayd/alpine-deno:1.2.0 as builder
LABEL maintainer="guzhongren@live.cn"
WORKDIR /app
COPY deps.ts /app
RUN deno cache deps.ts
ADD . /app
RUN deno cache ./deps.ts
RUN deno bundle src/index.ts ./platform.js


FROM hayd/alpine-deno:1.2.0
ENV TZ "Asia/Shanghai"
WORKDIR /root/
COPY --from=builder /app/platform.js .
EXPOSE 8000
# RUN deno run --allow-net --allow-env ./platform.js
ENTRYPOINT [ "deno", "run", "--allow-net", "--allow-env", "./platform.js" ]
