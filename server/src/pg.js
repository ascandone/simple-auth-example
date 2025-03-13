const pg = require("pg");

const pool = new pg.Pool({
  // TODO fetch from env
  user: "postgres",
  password: "postgres",
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
