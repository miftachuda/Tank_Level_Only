const knex = require("knex");
const knexInstance = knex({
  client: "better-sqlite3",
  connection: {
    filename: "./database.db",
  },
  useNullAsDefault: true,
});
