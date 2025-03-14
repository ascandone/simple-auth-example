import fs from "fs/promises";
import crypto from "node:crypto";

const JWT_SECRET = crypto.randomBytes(64).toString("hex");

await fs.appendFile(".env", `JWT_SECRET="${JWT_SECRET}"\n`, {});

console.log("Done ✅");
