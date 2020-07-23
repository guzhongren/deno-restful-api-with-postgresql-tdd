import {
  stub,
  Stub,
  Client,
  assertEquals,
  v4,
  assert,
  assertMatch,
  assertThrowsAsync,
} from "../../deps.ts";
import UserRepo from "../../src/repositories/userRepo.ts";
import client from "../../src/Utils/client.ts";
import IUser from "../../src/entity/User.ts";
import NotFoundException from "../../src/exception/NotFoundException.ts";
import InvalidedParamsException from "../../src/exception/InvalidedParamsException.ts";
const { test } = Deno;

test("UserRepo #create should return mocked User given username&password when create", async () => {
  const queryStub: Stub<Client> = stub(client, "query");
  const mockedQueryResult = {
    rowCount: 1,
  };
  queryStub.returns = [mockedQueryResult];
  const parameter: IUser = {
    username: "username",
    password: "password",
  };
  const userRepo = new UserRepo();
  userRepo.client = client;
  const createdUserResult = await userRepo.create(parameter);

  assertEquals(createdUserResult.username, parameter.username);
  assertEquals(createdUserResult.password, parameter.password);
  assert(v4.validate(createdUserResult.id!));
  assertMatch(
    createdUserResult.registrationDate!,
    /[\d]{4}-[\d]{2}-[\d]{2}T[\d]{2}:[\d]{2}:[\d]{2}\.[\d]{1,3}Z/,
  );

  queryStub.restore();
});

test("UserRepo #create should throw exception given no value for field when create", async () => {
  const parameter: IUser = {
    username: "",
    password: "",
  };

  const userRepo = new UserRepo();

  assertThrowsAsync(async () => {
    await userRepo.create(parameter)
  }, InvalidedParamsException,
  "should supply valid username and password!")
});


test("UserRepo #queryAll should return UserList when invoke queryAll", async () => {
  const registrationDate = (new Date()).toISOString();
  const queryStub: Stub<Client> = stub(client, "query");
  const id1 = v4.generate();
  const id2 = v4.generate();
  const mockedQueryResult = {
    rowCount: 2,
    rows: [
      [
        id1,
        "username1",
        registrationDate,
        false,
      ],
      [
        id2,
        "username2",
        registrationDate,
        false,
      ],
    ],
  };

  const expectUserList: Array<IUser> = [
    {
      id: id1,
      username: "username1",
      registrationDate: registrationDate,
      deleted: false,
    },
    {
      id: id2,
      username: "username2",
      registrationDate: registrationDate,
      deleted: false,
    },
  ];
  queryStub.returns = [mockedQueryResult];

  const userRepo = new UserRepo();
  userRepo.client = client;
  const queriedUserList = await userRepo.queryAll();

  assertEquals(queriedUserList, expectUserList);

  queryStub.restore();
});

test("UserRepo #queryAll should return empty array when invoke queryAll", async () => {
  const queryStub: Stub<Client> = stub(client, "query");
  const mockedQueryResult = {
    rowCount: 0,
    rows: [],
  };

  const expectUserList: Array<IUser> = [];
  queryStub.returns = [mockedQueryResult];

  const userRepo = new UserRepo();
  const queriedUserList = await userRepo.queryAll();

  assertEquals(queriedUserList, expectUserList);

  queryStub.restore();
});

test("UserRepo #queryById should return a user given id is 1 when invoke queryById", async () => {
  const userRepo = new UserRepo();
  userRepo.client = client;
  const mockedId = v4.generate();
  const mockedRecitationDate = (new Date()).toISOString();
  const mockedQueryByIdResult = {
    rowCount: 1,
    rows: [
      [
        mockedId,
        "username",
        mockedRecitationDate,
        false,
      ],
    ],
  };
  const expectUser: IUser = {
    id: mockedId,
    username: "username",
    registrationDate: mockedRecitationDate,
    deleted: false,
  };
  const queryStub: Stub<Client> = stub(client, "query");
  queryStub.returns = [
    mockedQueryByIdResult,
  ];
  assertEquals(await userRepo.queryById("1"), expectUser);
  queryStub.restore();
});

test("UserRepo #queryById should throw exception given empty queryResult when invoked queryById method ", async () => {
  const userRepo = new UserRepo();
  const mockedQueryResult = {
    rowCount: 0,
    rows: [],
  };
  const queryStub: Stub<Client> = stub(client, "query");
  queryStub.returns = [mockedQueryResult];
  userRepo.client = client;
  assertThrowsAsync(async () => {
    await userRepo.queryById("anyId");
  }, NotFoundException);
  queryStub.restore();
});

test("UserRepo #deleteById should return true given userId is anyId when delete a user", async () => {
  const queryStub: Stub<Client> = stub(client, "query");
  queryStub.returns = [true];

  const userRepo = new UserRepo();
  userRepo.client = client;

  assertEquals(await userRepo.deleteById("anyId"), true);
  queryStub.restore();
});
