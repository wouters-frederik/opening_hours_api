// Load modules
const dbPool = require('./db');


async function createEntity (name,reference,user_id) {
    const [results, fields] = await dbPool.query('INSERT into entities (`name`, `remote_id`, `created`, `created_by`) VALUES (?,?,?,?)', [
        name,reference,Math.floor(new Date().getTime()/1000),user_id
    ]);
    return results.insertId;
}

async function loadEntities () {
    const [rows, fields] =  await dbPool.query('SELECT e.*, u.name as user_name FROM entities e, users u WHERE e.`created_by` = u.`id` ORDER BY name ASC', []);
    global.entities = rows;
    return rows;
}


async function loadEntity(searchId) {
        const [rows, fields] =  await dbPool.query('SELECT e.*, u.name as user_name FROM entities e, users u WHERE e.`created_by` = u.`id` AND e.id = ?', [parseInt(searchId)]);
        return rows[0];
}

async function deleteEntity (searchId) {
    var res = await dbPool.query('DELETE FROM entities WHERE id = ? ', [parseInt(searchId)]);
    return true;
}

module.exports = {
    loadEntities: loadEntities,
    loadEntity: loadEntity,
    createEntity: createEntity,
    deleteEntity:deleteEntity,
}