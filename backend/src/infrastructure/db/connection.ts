import { Pool } from "pg";

export const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "fuel_eu",
  password: "root",
  port: 5432,
});