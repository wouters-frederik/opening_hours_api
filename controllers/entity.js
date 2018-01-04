// Load modules
const dbPool = require('./db');


async function loadEntities () {
    const [rows, fields] =  await dbPool.query('SELECT e.*, u.name as user_name FROM entities e, users u WHERE e.`created_by` = u.`id` ORDER BY name ASC', []);
    global.entities = rows;
    return rows;
}


async function loadEntity(searchId) {
        const [rows, fields] =  await dbPool.query('SELECT e.*, u.name as user_name FROM entities e, users u WHERE e.`created_by` = u.`id` AND e.id = ?', [parseInt(searchId)]);
        return rows[0];
}

module.exports = {
    loadEntities: loadEntities,
    loadEntity: loadEntity
}