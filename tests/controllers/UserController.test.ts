import {
  stub,
  Stub,
  assertEquals,
  v4,
  assertThrowsAsync,
  Application,
  Router,
} from "../../deps.ts";
import UserController from "../../src/controllers/UserController.ts";
import IResponse from "../../src/controllers/model/IResponse.ts";
import UserService from "../../src/services/UserService.ts";
import IUser, { User } from "../../src/entity/User.ts";
import InvalidedParamsException from "../../src/exception/InvalidedParamsException.ts";
import {TEST_PORT} from '../testFixtures.ts'

const { test } = Deno;


const userId = v4.generate();
const registrationDate = (new Date()).toISOString();

const mockedUser: User = {
  id: userId,
  username: "username",
  registrationDate,
  deleted: false,
};

test("UserController #addUser should return added user when add user", async () => {
  const userService = new UserService();
  const queryAllStub: Stub<UserService> = stub(userService, "addUser");
  const expectResponse = {
    success: true,
    data: mockedUser,
  };
  queryAllStub.returns = [mockedUser];
  const userController = new UserController();
  userController.userService = userService;

  const app = new Application();
  const router = new Router();
  const abortController = new AbortController();
  const { signal } = abortController;

  router.post("/users", async (context) => {
    return await userController.addUser(context);
  });

  app.use(router.routes());

  app.listen({ port: TEST_PORT, signal });

  const response = await fetch(`http://127.0.0.1:${TEST_PORT}/users`, {
    method: "POST",
    body: "name=name&password=123",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  assertEquals(response.ok, true);
  const responseJSON = await response.json();

  assertEquals(responseJSON, expectResponse);
  abortController.abort();

  queryAllStub.restore();
});

test("UserController #addUser should throw exception about no params given no params when add user", async () => {
  const userService = new UserService();
  const queryAllStub: Stub<UserService> = stub(userService, "addUser");
  queryAllStub.returns = [mockedUser];
  const userController = new UserController();
  userController.userService = userService;

  const app = new Application();
  const router = new Router();
  const abortController = new AbortController();
  const { signal } = abortController;

  router.post("/users", async (context) => {
    await assertThrowsAsync(
      async () => {
        await userController.addUser(context);
      },
      InvalidedParamsException,
      "should given params: name ...",
    );
    abortController.abort();
    queryAllStub.restore();
  });

  app.use(router.routes());

  app.listen({ port: TEST_PORT, signal });

  const response = await fetch(`http://127.0.0.1:${TEST_PORT}/users`, {
    method: "POST",
    body: "",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  await response.body!.cancel();
});

test("UserController #addUser should throw exception about no correct params given wrong params when add user", async () => {
  const userService = new UserService();
  const queryAllStub: Stub<UserService> = stub(userService, "addUser");

  queryAllStub.returns = [mockedUser];
  const userController = new UserController();
  userController.userService = userService;

  const app = new Application();
  const router = new Router();
  const abortController = new AbortController();
  const { signal } = abortController;

  router.post("/users", async (context) => {
    await assertThrowsAsync(
      async () => {
        await userController.addUser(context);
      },
      InvalidedParamsException,
      "should given param name and password",
    );
    abortController.abort();
    queryAllStub.restore();
  });

  app.use(router.routes());

  app.listen({ port: TEST_PORT, signal });

  const response = await fetch(`http://127.0.0.1:${TEST_PORT}/users`, {
    method: "POST",
    body: "wrong=params",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  await response.body!.cancel();
});

test("UserController #queryAll should return a userList when invoke query all", async () => {
  const ids = [v4.generate(), v4.generate()];
  const regs = [(new Date()).toISOString(), (new Date()).toISOString()];
  const userService = new UserService();
  const queryAllStub: Stub<UserService> = stub(userService, "queryAll");
  const mockedUserList = [
    {
      id: ids[0],
      username: "username",
      registrationDate: regs[0],
      deleted: false,
    } as IUser,
    {
      id: ids[1],
      username: "username1",
      registrationDate: regs[1],
      deleted: false,
    } as IUser,
  ];
  const expectResponse = {
    success: true,
    data: mockedUserList,
  };
  queryAllStub.returns = [mockedUserList];
  const userController = new UserController();
  userController.userService = userService;
  const app = new Application();
  const router = new Router();
  const abortController = new AbortController();
  const { signal } = abortController;

  router.get("/users", async (context) => {
    return await userController.queryAll(context);
  });

  app.use(router.routes());

  const randomPort = 1234;
  app.listen({ port: randomPort, signal });

  const response = await fetch(`http://localhost:${randomPort}/users`);
  const responseJSON = await response.json();

  assertEquals(responseJSON, expectResponse);
  abortController.abort();

  queryAllStub.restore();
});

test("UserController #deleteById should return true given a userId when delete", async () => {
  const expectResponse = {
    success: true,
    data: true,
  };

  const userService = new UserService();
  const deleteStub: Stub<UserService> = stub(userService, "deleteById");
  deleteStub.returns = [true];

  const userController = new UserController();
  userController.userService = userService;

  const app = new Application();
  const router = new Router();
  const abortController = new AbortController();
  const { signal } = abortController;

  router.delete("/users/:id", async (context) => {
    return await userController.deleteById(context);
  });

  app.use(router.routes());

  app.listen({ port: TEST_PORT, signal });

  const deletedId = v4.generate();
  const response = await fetch(`http://localhost:${TEST_PORT}/users/${deletedId}`, {
    method: "DELETE",
  });

  const responseJSON = await response.json();

  assertEquals(responseJSON, expectResponse);
  abortController.abort();

  deleteStub.restore();
});

test("UserController #deleteById should throw exception given userId is not UUID when delete", async () => {
  const userController = new UserController();

  const app = new Application();
  const router = new Router();
  const abortController = new AbortController();
  const { signal } = abortController;

  router.delete("/users/:id", async (context) => {
    await assertThrowsAsync(
      async () => {
        await userController.deleteById(context);
      },
      InvalidedParamsException,
      "should given user UUID id",
    );
    abortController.abort();
  });

  app.use(router.routes());

  app.listen({ port: TEST_PORT, signal });

  const notValidatedId = "not_a_valid_UUID";
  const response = await fetch(
    `http://localhost:${TEST_PORT}/users/${notValidatedId}`,
    {
      method: "DELETE",
    },
  );
  await response.body!.cancel();
});

test("UserController #queryById should return a user who's id is UUID given id is UUID when query user by id", async () => {
  const expectResponse = {
    success: true,
    data: mockedUser,
  } as IResponse;

  const userController = new UserController();
  const userService = new UserService();
  const queryByIdStub: Stub<UserService> = stub(userService, "queryById");
  queryByIdStub.returns = [mockedUser];
  userController.userService = userService;

  const app = new Application();
  const router = new Router();
  const abortController = new AbortController();
  const { signal } = abortController;

  router.get("/users/:id", async (context) => {
    return await userController.queryById(context);
  });

  app.use(router.routes());

  app.listen({ port: TEST_PORT, signal });

  const deletedId = v4.generate();
  const response = await fetch(`http://localhost:${TEST_PORT}/users/${deletedId}`, {
    method: "GET",
  });

  const responseJSON = await response.json();

  assertEquals(responseJSON, expectResponse);
  abortController.abort();

  queryByIdStub.restore();
});

test("UserController #queryById should throw exception given userId is not UUID when delete", async () => {
  const userController = new UserController();

  const app = new Application();
  const router = new Router();
  const abortController = new AbortController();
  const { signal } = abortController;

  router.get("/users/:id", async (context) => {
    await assertThrowsAsync(
      async () => {
        await userController.queryById(context);
      },
      InvalidedParamsException,
      "user id should be a UUID",
    );
    abortController.abort();
  });

  app.use(router.routes());

  app.listen({ port: TEST_PORT, signal });

  const notValidatedId = "not_a_valid_UUID";
  const response = await fetch(
    `http://localhost:${TEST_PORT}/users/${notValidatedId}`,
    {
      method: "GET",
    },
  );
  await response.body!.cancel();
});
