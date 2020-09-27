import UserRepo from "../repositories/userRepo.ts";

export default class UserService {
  constructor() {
    this.userRepo = new UserRepo();
  }
  userRepo = new UserRepo();
  async addUser(user: any) {
    return await this.userRepo.save(user)
  }
}
