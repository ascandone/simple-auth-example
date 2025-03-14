import { after, test } from "node:test";
import assert from "node:assert/strict";
import * as users from "./users.js";
import crypto from "node:crypto";
import { pool } from "./pg.js";

test("login with the correct password", async () => {
  const username = randUserName();
  const reg = await users.register(username, "password");
  assert.equal(reg, undefined);

  const ok = await users.login(username, "password");
  assert.equal(ok, true);
});

test("err for login with wrong password", async () => {
  const username = randUserName();
  const reg = await users.register(username, "password");
  assert.equal(reg, undefined);

  const ok = await users.login(username, "wrong-pw");
  assert.equal(ok, false);
});

test("err for login when user does not exist", async () => {
  const ok = await users.login("invalid-user", "password");
  assert.equal(ok, false);
});

test("get counter is 0 initially", async () => {
  const username = randUserName();
  await users.register(username, "password");
  const counter = await users.getCounter(username);
  assert.equal(counter, 0);
});

test("increment counter", async () => {
  const username = randUserName();
  await users.register(username, "password");

  await users.incrementCounter(username);
  await users.incrementCounter(username);
  await users.incrementCounter(username);

  const counter = await users.getCounter(username);
  assert.equal(counter, 3);
});

// getting a counter of a user that doesn't exist is an undefined behaviour

after(() => {
  pool.end();
});

function randUserName() {
  const rand = crypto.randomBytes(12).toString("hex");
  return `user${rand}`;
}
