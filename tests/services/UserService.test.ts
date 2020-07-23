import {
  stub,
  Stub,
  assertEquals,
  v4,
} from "../../deps.ts";
import UserRepo from "../../src/repositories/userRepo.ts";
import UserService from "../../src/services/UserService.ts";
import IUser from "../../src/entity/User.ts";
const { test } = Deno;

test("UserService #addUser should return added user", async () => {
  const parameter: IUser = {
    username: "username",
    password: "password",
  };
  const registrationDate = (new Date()).toISOString();
  const id = v4.generate();
  const mockedUser: IUser = {
    ...parameter,
    id,
    registrationDate,
    deleted: false,
  };
  const userRepo = new UserRepo();
  const createUserStub: Stub<UserRepo> = stub(userRepo, "create");
  createUserStub.returns = [mockedUser];

  const userService = new UserService();
  userService.userRepo = userRepo;
  assertEquals(await userService.addUser(parameter), mockedUser);
  createUserStub.restore();
});

test("UserService #queryAll should return userList when invoke queryAll", async () => {
  const registrationDate = (new Date()).toISOString();

  const idList = [v4.generate(), v4.generate()];
  const expectUserList: Array<IUser> = [
    {
      username: "username",
      password: "password",
      id: idList[0],
      registrationDate,
      deleted: false,
    },
    {
      username: "username1",
      password: "password1",
      id: idList[1],
      registrationDate,
      deleted: false,
    },
  ];
  const mockedUserList = [
    {
      username: "username",
      password: "password",
      id: idList[0],
      registrationDate,
      deleted: false,
    },
    {
      username: "username1",
      password: "password1",
      id: idList[1],
      registrationDate,
      deleted: false,
    },
  ];
  const userRepo = new UserRepo();
  const createUserStub: Stub<UserRepo> = stub(userRepo, "queryAll");

  createUserStub.returns = [mockedUserList];

  const userService = new UserService();
  userService.userRepo = userRepo;
  assertEquals(await userService.queryAll(), expectUserList);
  createUserStub.restore();
});

test("UserService #queryById should return a user who id is anyId", async () => {
  const mockedUser: IUser = {
    id: "anyId",
    username: "username",
    registrationDate: (new Date().toISOString()),
    deleted: false,
  };

  const userRepo = new UserRepo();
  const queryByIdStub: Stub<UserRepo> = stub(userRepo, "queryById");

  queryByIdStub.returns = [mockedUser];

  const userService = new UserService();
  userService.userRepo = userRepo;

  assertEquals(await userService.queryById("anyId"), mockedUser);

  queryByIdStub.restore();
});

test("UserService #queryByName should return a user username is username given name is username when queryByName", async () => {
  const username = "username";
  const mockedUser: IUser = {
    id: "id",
    username,
    registrationDate: (new Date()).toISOString(),
    deleted: false,
  };
  const userRepo = new UserRepo();
  const queryByNameStub: Stub<UserRepo> = stub(userRepo, "queryByName");
  queryByNameStub.returns = [mockedUser];

  const userService = new UserService();
  userService.userRepo = userRepo;
  assertEquals(await userService.queryByName(username), mockedUser);
  queryByNameStub.restore();
});

test("UserService #deleteById should return true given id is anyId when delete a user", async () => {
  const userRepo = new UserRepo();
  const deleteStub: Stub<UserRepo> = stub(userRepo, "deleteById");
  deleteStub.returns = [true];

  const userService = new UserService();
  userService.userRepo = userRepo;

  assertEquals(await userService.deleteById("anyId"), true);

  deleteStub.restore();
});
