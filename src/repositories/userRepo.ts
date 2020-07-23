import client from "../Utils/client.ts";
import IUser from "../entity/User.ts";
import { v4, Client } from "../../deps.ts";
import InvalidedParamsException from "../exception/InvalidedParamsException.ts";
import NotFoundException from "../exception/NotFoundException.ts";

export interface IUserRepo {
  create(user: IUser): Promise<IUser>;
  queryAll(): Promise<Array<IUser>>;
  queryById(id: string): Promise<IUser>;
  queryByName(name: string): Promise<IUser>;
  update?(user: IUser): Promise<IUser>;
  delete?(id: string): boolean;
}

export default class UserRepo implements IUserRepo {
  client: Client;
  constructor() {
    this.client = client;
  }
  async create(user: IUser) {
    if(!user.username || !user.password) {
      throw new InvalidedParamsException("should supply valid username and password!")
    }
    user.id = v4.generate();
    user.registrationDate = (new Date()).toISOString();
    await this.client.query(
      "INSERT INTO public.user (id, username, password, registration_date, deleted) VALUES ($1, $2, $3,$4, $5)",
      user.id,
      user.username,
      user.password,
      user.registrationDate,
      false,
    );
    return user;
  }
  async queryAll() {
    const userList = await this.client!.query(
      "select id, username,registration_date, deleted from public.user where deleted<>true",
    );
    return userList.rows.map((user) => {
      let u: IUser = {
        id: user[0],
        username: user[1],
        registrationDate: user[2],
        deleted: user[3],
      };
      return u;
    });
  }
  async queryById(id: string): Promise<IUser> {
    if (!id) {
      throw new InvalidedParamsException("should supply parameter: id");
    }
    const queryResult = await this.client.query(
      `select id,username,registration_date, deleted from public.user where id=$1`,
      id,
    );
    if (queryResult.rows.length <= 0) {
      throw new NotFoundException(`Not found any user by id: ${id}`);
    }
    const userList = queryResult.rows.map((user) => {
      let u: IUser = {
        id: user[0],
        username: user[1],
        registrationDate: user[2],
        deleted: user[3],
      };
      return u;
    });

    return userList[0];
  }
  async queryByName(name: string): Promise<IUser> {
    const queryResult = await this.client.query(
      `select id,username,registration_date, deleted from public.user where username=$1`,
      name,
    );

    const userList = queryResult.rows.map((user) => {
      let u: IUser = {
        id: user[0],
        username: user[1],
        registrationDate: user[2],
        deleted: user[3],
      };
      return u;
    });
    return userList[0];
  }
  async deleteById(id: string): Promise<boolean> {
    const updateResult = await this.client.query(
      `update public.user set deleted=true where id=$1`,
      id,
    );
    return true;
  }
}
