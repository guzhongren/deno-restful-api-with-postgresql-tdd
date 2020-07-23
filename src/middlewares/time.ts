import { Response } from "../../deps.ts";

export default async (
  { response }: { response: Response },
  next: () => Promise<void>,
) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  response.headers.set("X-Response-Time", `${ms}ms`);
};
