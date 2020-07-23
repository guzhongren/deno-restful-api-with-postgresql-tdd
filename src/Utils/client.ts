import { Client } from "../../deps.ts";
import {
  DB_HOST,
  DB_DATABASE,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
} from "../config.ts";

const client = new Client({
  hostname: DB_HOST,
  database: DB_DATABASE,
  user: DB_USER,
  password: DB_PASSWORD,
  port: DB_PORT,
});

export default client;
