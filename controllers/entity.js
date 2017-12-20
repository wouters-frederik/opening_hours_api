// Load modules
const dbPool = require('./db');


async function loadEntities () {
    const [rows, fields] =  await dbPool.query('SELECT * FROM entities WHERE 1 ORDER BY name ASC', []);
    global.entities = rows;
    return rows;
}


async function loadEntity(searchId) {
        const [rows, fields] =  await dbPool.query('SELECT * FROM entities WHERE id = ? ', [parseInt(searchId)]);
        return rows[0];
}

module.exports = {
    loadEntities: loadEntities,
    loadEntity: loadEntity
}