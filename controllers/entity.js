// Load modules
const dbPool = require('./db');


async function loadEntities () {
    const [rows, fields] =  await dbPool.query('SELECT * FROM entities WHERE 1 ORDER BY name ASC', []);
    return rows;
}


function loadEntity(searchId) {
  console.log('loadEntities');
  console.log(global.entities);
  var $entity = {};
  global.entities.forEach(function (item, index) {
    if (item.id == searchId) {
        $entity = item;
    }
  });
  return $entity;
}

module.exports = {
    loadEntities: loadEntities,
    loadEntity: loadEntity
}