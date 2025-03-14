const pg = require("pg");
const env = require("./env");

const pool = new pg.Pool({
  user: env.PG_USER,
  password: env.PG_PASSWORD,
});

/**
 * @param templateStringsArray {TemplateStringsArray}
 */
function handleTemplateStringsArray(templateStringsArray) {
  return templateStringsArray
    .map((fragment, index) => {
      const isLast = index === templateStringsArray.length - 1;
      if (isLast) {
        return fragment;
      } else {
        return `${fragment}$${index + 1}`;
      }
    })
    .join("");
}

/**
 * @param templateStringsArray {TemplateStringsArray}
 */
function sql(templateStringsArray, ...values) {
  const q = handleTemplateStringsArray(templateStringsArray);
  return pool.query(q, values);
}

module.exports = {
  sql,
  handleTemplateStringsArray, // exported for test purposes
};
