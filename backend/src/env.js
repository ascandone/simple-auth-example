switch (process.env.NODE_ENV) {
  case "prod":
  case undefined:
    require("dotenv").config();
    break;

  case "dev":
    require("dotenv").config({ path: ".env.dev" });
    break;
  default:
}

module.exports = {};

function checkAndExport(name, parse = (x) => x) {
  if (typeof process.env[name] !== "string") {
    throw new Error(
      `Env var ${name} is not defined (using ${
        process.env.NODE_ENV ?? "production"
      } env)`
    );
  }

  module.exports[name] = parse(process.env[name]);
}

checkAndExport("PG_USER");
checkAndExport("PG_PASSWORD");
checkAndExport("SALT_ROUNDS", Number);
checkAndExport("FRONTEND_URL");
checkAndExport("JWT_SECRET");
