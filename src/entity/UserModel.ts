import { Model, DataTypes } from '../../deps.ts'
import dbClient from '../Utils/dbClient.ts';

class UserModel extends Model {
  static table = 'users';
  static timestamps = true;

  static fields = {
    id: { primaryKey: true, type: DataTypes.UUID },
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    delete: DataTypes.BOOLEAN,
  };
}

dbClient.link([UserModel])
await dbClient.sync({ drop: false });

export default UserModel