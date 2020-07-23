import { Request, Response, Status, RouteParams, v4 } from "../../deps.ts";
import User from "../entity/User.ts";
import IResponse from "./model/IResponse.ts";
import UserService from "../services/UserService.ts";
import InvalidedParamsException from "../exception/InvalidedParamsException.ts";

export default class UserController {
  userService: UserService;
  constructor() {
    this.userService = new UserService();
  }
  async addUser(
    { request, response }: { request: Request; response: Response },
  ) {
    if (!request.hasBody) {
      throw new InvalidedParamsException("should given params: name ...");
    }
    const body = request.body();
    const searchParams = await body.value;
    const name = searchParams.get("name");
    const password = searchParams.get("password");
    if (!name || !password) {
      throw new InvalidedParamsException(
        "should given param name and password",
      );
    }
    const user: User = {
      username: name,
      password,
    };
    const addedUser = await this.userService.addUser(user);
    response.status = Status.Created;
    const res: IResponse = {
      success: true,
      data: addedUser,
    };
    response.body = res;
  }

  async queryAll({ response }: { response: Response }) {
    const userList: Array<User> = await this.userService.queryAll();
    const res: IResponse = {
      success: true,
      data: userList,
    };
    response.status = Status.OK;
    response.body = res;
  }

  async queryById(
    { params, response }: { params: RouteParams; response: Response },
  ) {
    const id = params.id;
    if (!v4.validate(id!)) {
      throw new InvalidedParamsException("user id should be a UUID");
    }
    const user = await this.userService.queryById(id!);
    const res: IResponse = {
      success: true,
      data: user,
    };
    response.status = Status.OK;
    response.body = res;
  }
  async deleteById(
    { params, response }: { params: RouteParams; response: Response },
  ) {
    const userId = params.id;
    if (!v4.validate(userId!)) {
      throw new InvalidedParamsException("should given user UUID id");
    }
    await this.userService.deleteById(userId!);

    const responseBody: IResponse = {
      success: true,
      data: true,
    };
    response.status = Status.OK;
    response.body = responseBody;
  }
}
