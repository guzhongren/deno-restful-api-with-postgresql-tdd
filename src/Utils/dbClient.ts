import { Database } from "../../deps.ts";
import {
  DB_HOST,
  DB_DATABASE,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
} from "../config.ts";


const dbClient = new Database('postgres', {
  database: DB_DATABASE,
  host: DB_HOST,
  username: DB_USER,
  password: DB_PASSWORD,
  port: DB_PORT
});


export default dbClient;
