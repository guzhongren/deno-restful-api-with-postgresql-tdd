import { DataTypes, Database, Model } from '../deps.ts';

const db = new Database('postgres', {
  database: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: '0',
  port: 5432
});
// console.log(db)

class Flight extends Model {
  static table = 'flights';
  static timestamps = true;

  static fields = {
    id: { primaryKey: true, autoIncrement: true },
    departure: DataTypes.STRING,
    destination: DataTypes.STRING,
    flightDuration: DataTypes.FLOAT,
  };

  static defaults = {
    flightDuration: 2.5,
  };
}

db.link([Flight]);

await db.sync({ drop: true });

await Flight.create({
  departure: 'Paris',
  destination: 'Tokyo',
});