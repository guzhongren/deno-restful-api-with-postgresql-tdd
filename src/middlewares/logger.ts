import { Response, Request } from "../../deps.ts";

export default async (
  {
    response,
    request,
  }: { response: Response; request: Request },
  next: () => Promise<void>,
) => {
  await next();
  const rt = response.headers.get("X-Response-Time");
  console.log(`${request.method} ${request.url} - ${rt}`);
};
