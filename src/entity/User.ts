export default interface IUser {
  id?: string;
  username?: string;
  password?: string;
  registrationDate?: string;
  deleted?: boolean;
}
export class User implements IUser {}
