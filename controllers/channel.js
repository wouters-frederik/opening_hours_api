// Load modules
const dbPool = require('./db');

function loadChannels () {
  dbPool.query('SELECT * FROM channels WHERE 1 ORDER BY name ASC', [],
    function (error, results, fields) {
      //console.log(typeof error);
      if (!error) {
        console.log(results);
        global.channels = results;
      } else {
        //console.log('error', error);
      }
      // error will be an Error if one occurred during the query
      // results will contain the results of the query
      // fields will contain information about the returned results fields (if any)
    });
}

function loadChannel (searchId) {
  global.channels.forEach(function (item) {
    if (item.id == searchId) {
      return item;
    }
  })
}

function loadChannelByOrganisation (searchId) {
  var $channels = [];
  console.log(global.channels);
  global.channels.forEach(function (item) {
    if (item.organisation_id == searchId) {
      $channels.push(item);
    }
  });
  console.log('CHANNELS FOUND');
  console.log($channels);
  return $channels;
}

module.exports = {
  loadChannels: loadChannels,
  loadChannel: loadChannel,
  loadChannelByOrganisation: loadChannelByOrganisation
}