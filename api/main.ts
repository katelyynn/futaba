import { Application, Router } from "@oak/oak";
import { oakCors } from "@tajpouria/cors";
import routeStaticFiles from "./util/static.ts";

export const app = new Application();
const router = new Router();

app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());
app.use(routeStaticFiles([
  `${Deno.cwd()}/dist`,
  `${Deno.cwd()}/public`,
]));

if (import.meta.main) {
  console.log("Server listening on port http://localhost:8000");
  await app.listen({ port: 8000 });
}
