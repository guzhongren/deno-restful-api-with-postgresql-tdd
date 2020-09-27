# FROM hayd/alpine-deno:1.2.0 as builder
# LABEL maintainer="guzhongren@live.cn"
# WORKDIR /app
# COPY deps.ts /app
# RUN deno cache deps.ts
# ADD . /app
# RUN deno cache ./deps.ts
# EXPOSE 8000
# RUN deno bundle src/index.ts ./platform.js

FROM hayd/alpine-deno:1.4.0

EXPOSE 8000

WORKDIR /app

# Prefer not to run as root.
USER deno

# Cache the dependencies as a layer (the following two steps are re-run only when deps.ts is modified).
# Ideally fetch deps.ts will download and compile _all_ external files used in main.ts.
COPY deps.ts /app
RUN deno cache deps.ts

# These steps will be re-run upon each file change in your working directory:
ADD . .
# Compile the main app so that it doesn't need to be compiled each startup/entry.
RUN deno cache -r --lock=lock.json ./deps.ts

CMD ["--allow-net", "--allow-env", "./src/index.ts"]


# FROM hayd/alpine-deno:1.2.0
# ENV TZ "Asia/Shanghai"
# WORKDIR /root/
# COPY --from=builder /app/platform.js .
# EXPOSE 8000
# # RUN deno run --allow-net --allow-env ./platform.js
# ENTRYPOINT [ "deno", "run", "--allow-net", "--allow-env", "./platform.js" ]
