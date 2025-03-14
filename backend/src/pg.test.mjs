import { test } from "node:test";
import * as assert from "node:assert/strict";
import { handleTemplateStringsArray } from "./pg.js";

test("generate sql string", () => {
  const id = 0,
    name = "johndoe";

  const str = handleTemplateStringsArray`
    SELECT * FROM users
    WHERE id = ${id} AND name = ${name}
  `;

  assert.equal(
    str,
    `
    SELECT * FROM users
    WHERE id = $1 AND name = $2
  `
  );
});
