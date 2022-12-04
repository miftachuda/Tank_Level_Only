
const knex = require('knex');

const knexInstance = knex({
    client: 'better-sqlite3',
    connection: {
        filename: "./database.db"
    },
    useNullAsDefault: true
})
function createTable() {
    knexInstance.schema.hasTable("tank").then(function (exists) {
        if (!exists) {
            return knexInstance.schema.createTable("tank", function (table) {
                table.json('data')
                table.timestamp('timestamp')
            });
        }
    });
    knexInstance.schema.hasTable("logsheet").then(function (exists) {
        if (!exists) {
            return knexInstance.schema.createTable("logsheet", function (table) {
                table.json('data')
                table.timestamp('timestamp')
            });
        }
    });

}


createTable()

module.exports = knexInstance