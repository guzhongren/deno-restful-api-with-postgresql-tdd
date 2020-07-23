import { Response, Status } from "../../deps.ts";
import IResponse from "../controllers/model/IResponse.ts";
import InvalidedParamsException from "../exception/InvalidedParamsException.ts";
import NotFoundException from "../exception/NotFoundException.ts";

export default async (
  { response }: { response: Response },
  next: () => Promise<void>,
) => {
  try {
    await next();
  } catch (err) {
    let status: Status;
    let body: any;
    if (err instanceof InvalidedParamsException) {
      status = Status.BadRequest;
      body = {
        success: false,
        msg: err.message,
      };
    } else if (err instanceof NotFoundException) {
      status = Status.OK;
      body = {
        success: true,
        date: [],
      };
    } else {
      status = Status.BadRequest;
      body = {
        success: true,
        msg: "未知错误",
      } as IResponse;
    }
    response.status = status;
    response.body = body;
  }
};
