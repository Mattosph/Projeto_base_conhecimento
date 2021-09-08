
exports.up = function (knex, Promise) {
    return knex.schema.alterTable('categories', table => { // creates a new colloumn to add the time stamp for the deleted categories timestamp 
        table.timestamp('deletedAt')
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.alterTable('categories', table => {
        table.dropColumn('deletedAt')
    })
};