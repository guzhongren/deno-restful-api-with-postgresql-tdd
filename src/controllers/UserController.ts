import { Request, Response, Status, RouteParams, v4 } from "../../deps.ts";
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
    const user = {
      username: name,
      password,
    };
    return response.body = await this.userService.addUser(user)
  }
}
