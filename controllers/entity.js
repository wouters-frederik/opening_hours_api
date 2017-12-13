// Load modules
const dbPool = require('./db');


function loadEntities () {
  dbPool.query('SELECT * FROM entities WHERE 1 ORDER BY name ASC', [],
    function (error, results, fields) {
      //console.log(typeof error);
      if (!error) {
        var $orgs = {};
        console.log(results);
        var entities = {};
        global.entities = results;
      }
      // error will be an Error if one occurred during the query
      // results will contain the results of the query
      // fields will contain information about the returned results fields (if any)
    });
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