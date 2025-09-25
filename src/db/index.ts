import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";

console.log("DATABASE_URL", process.env.DATABASE_URL);
if (process.env.DATABASE_URL === undefined) {
  console.log(process.env);
  throw new Error("DATABASE_URL is not set");
}

const sqlite = new Database(process.env.DATABASE_URL);
export const db = drizzle({
  client: sqlite,
  schema
});