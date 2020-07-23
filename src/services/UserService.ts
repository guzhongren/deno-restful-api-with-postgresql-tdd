import UserRepo from "../repositories/userRepo.ts";
import IUser from "../entity/User.ts";

export default class UserService {
  constructor() {
    this.userRepo = new UserRepo();
  }
  userRepo = new UserRepo();
  async addUser(user: IUser) {
    return await this.userRepo.create(user);
  }

  async queryAll() {
    const userList = await this.userRepo.queryAll();
    return userList;
  }
  async queryById(id: string) {
    return await this.userRepo.queryById(id);
  }

  async queryByName(name: string) {
    return await this.userRepo.queryByName(name);
  }
  async deleteById(id: string) {
    return await this.userRepo.deleteById(id);
  }
}
