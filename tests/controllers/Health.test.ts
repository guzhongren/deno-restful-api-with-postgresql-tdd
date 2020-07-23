import {
  assertEquals,
  Application,
  Router,
} from "../../deps.ts";
import { getHealthInfo } from "../../src/controllers/health.ts";
import {TEST_PORT} from '../testFixtures.ts'

const { test } = Deno;

test("health check", async () => {
  const expectResponse = {
    success: true,
    data: "Ok",
  };

  const app = new Application();
  const router = new Router();
  const abortController = new AbortController();
  const { signal } = abortController;

  router.get("/health", async ({ response }) => {
    getHealthInfo({ response });
  });

  app.use(router.routes());

  app.listen({ port: TEST_PORT, signal });

  const response = await fetch(`http://127.0.0.1:${TEST_PORT}/health`);

  assertEquals(response.ok, true);
  const responseJSON = await response.json();

  assertEquals(responseJSON, expectResponse);
  abortController.abort();
});
