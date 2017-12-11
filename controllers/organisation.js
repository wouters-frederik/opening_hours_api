// Load modules
const dbPool = require('./db');


function loadOrganisations () {
  dbPool.query('SELECT * FROM organisations WHERE 1 ORDER BY name ASC', [],
    function (error, results, fields) {
      //console.log(typeof error);
      if (!error) {
        var $orgs = {};
        console.log(results);
        var organisations = {};
        global.organisations = results;
      }
      // error will be an Error if one occurred during the query
      // results will contain the results of the query
      // fields will contain information about the returned results fields (if any)
    });
}

function loadOrganisation (searchId) {
  console.log('loadOrgs');
  console.log(global.organisations);
  var $organisation = {};
  global.organisations.forEach(function (item, index) {
    if (item.id == searchId) {
      $organisation = item;
    }
  });
  return $organisation;
}

module.exports = {
  loadOrganisations: loadOrganisations,
  loadOrganisation: loadOrganisation
}