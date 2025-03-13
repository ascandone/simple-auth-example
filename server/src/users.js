const bcrypt = require("bcrypt");
const { sql } = require("./pg");

// TODO Maybe this must be increased?
// TODO also, fetch from ENV
const saltRounds = 10;

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
      INSERT INTO USERS (username, "hashedPassword")
      VALUES (${username}, ${hashedPassword});
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

module.exports = {
  register,
  login,
};
