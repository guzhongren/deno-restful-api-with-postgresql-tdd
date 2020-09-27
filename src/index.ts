import { Application, send } from "../deps.ts";
import { APP_HOST, APP_PORT } from "./config.ts";
import router from "./router.ts";


import errorMiddleware from "./middlewares/error.ts";
import timeMiddleware from "./middlewares/time.ts";
import loggerMiddleware from "./middlewares/logger.ts";

export const listenToServer = async (app: Application) => {
  console.info(`Application started, and listen to ${APP_HOST}:${APP_PORT}`);
  await app.listen({
    hostname: APP_HOST,
    port: APP_PORT,
    secure: false,
  });
};

export function createApplication(): Promise<Application> {
  const app = new Application();
  app.use(loggerMiddleware);
  app.use(errorMiddleware);
  app.use(timeMiddleware);
  app.use(router.routes());

  app.use(async (context) => {
    await send(context, context.request.url.pathname, {
      root: `${Deno.cwd()}/examples/`,
      index: "index.html",
    });
  });

  return Promise.resolve(app);
}

if (import.meta.main) {
  const app = await createApplication();
  await listenToServer(app);
}
