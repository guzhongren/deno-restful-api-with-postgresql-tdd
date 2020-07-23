import { Response, Status } from "../../deps.ts";

import IResponse from "./model/IResponse.ts";

export const getHealthInfo = ({ response }: { response: Response }) => {
  response.status = Status.OK;
  const res: IResponse = {
    success: true,
    data: "Ok",
  };
  response.body = res;
};
