const bcrypt = require("bcrypt");

const saltRounds = 10;

const usersDb = new Map();

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

  if (usersDb.has(username)) {
    return "username already exists";
  }

  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

  usersDb.set(username, hashedPassword);
}

async function login(username, plainPassword) {
  const hashedPasswordLookup = usersDb.get(username);
  if (hashedPasswordLookup === undefined) {
    return false;
  }

  const isValidPassword = await bcrypt.compare(
    plainPassword,
    hashedPasswordLookup
  );

  return isValidPassword;
}

module.exports = {
  register,
  login,
};
