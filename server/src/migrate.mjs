// Quick and dirty migrations

import { sql } from "./pg.js";

await sql`
  CREATE TABLE IF NOT EXISTS USERS (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    "hashedPassword" VARCHAR(255),
    counter INTEGER NOT NULL DEFAULT 0
  );
`;

console.log("done!");
