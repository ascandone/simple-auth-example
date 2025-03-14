const bcrypt = require("bcrypt");
const { sql } = require("./pg");
const env = require("./env");

const saltRounds = env.SALT_ROUNDS;

function usernameValidation(username) {
  const USERNAME_RE = /^[a-z][a-z0-9]*$/;

  return (
    typeof username === "string" &&
    username.length >= 3 &&
    USERNAME_RE.test(username)
  );
}

function passwordValidation(username) {
  // TODO improve password validation
  const PASSWORD_RE = /^[a-zA-Z0-9]*$/;

  return (
    typeof username === "string" &&
    username.length >= 5 &&
    PASSWORD_RE.test(username)
  );
}

async function register(username, plainPassword) {
  if (!usernameValidation(username)) {
    return "invalid username";
  }

  if (!passwordValidation(plainPassword)) {
    return "invalid password";
  }

  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

  try {
    await sql`
      insert into USERS (username, "hashedPassword")
      values (${username}, ${hashedPassword});
    `;

    return undefined;
  } catch {
    // Actually, it could be other errors as well
    return "user already exists";
  }
}

async function login(username, plainPassword) {
  const result = await sql`
    select * from USERS
    where username = ${username}
  `;

  const [user] = result.rows;
  if (user === undefined) {
    return false;
  }

  const isValidPassword = await bcrypt.compare(
    plainPassword,
    user.hashedPassword
  );

  return isValidPassword;
}

async function getCounter(username) {
  const result = await sql`
    select counter from USERS
    where username = ${username}
  `;

  const [row] = result.rows;
  return row.counter;
}

async function incrementCounter(username) {
  await sql`
    update users 
    set counter = counter + 1
    where username = ${username};
  `;
}

module.exports = {
  register,
  login,
  getCounter,
  incrementCounter,
};
