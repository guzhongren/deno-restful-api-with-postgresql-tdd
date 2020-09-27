import { Router } from "../deps.ts";
import { API_VERSION } from "./config.ts";
import UserController from "./controllers/UserController.ts";
import { getHealthInfo } from './controllers/health.ts'

const router = new Router();

const userController = new UserController();
router.prefix(API_VERSION);
router
  .get("/health", getHealthInfo)
  .post("/users", async (context) => {
    return await userController.addUser(context)
  })
// .get("/users/:id", async (context) => {
//   return await userController.queryById(context);
// })
// .get("/users", async (context) => {
//   return await userController.queryAll(context);
// })
// .delete("/users/:id", async (context) => {
//   return await userController.deleteById(context);
// });

export default router;
