
import { v4 } from "../../deps.ts";


import UserModel from '../entity/UserModel.ts';

export default class UserRepo {


  async save(user: any) {
    user.id = v4.generate()
    return  await UserModel.create(user)
  }
}
