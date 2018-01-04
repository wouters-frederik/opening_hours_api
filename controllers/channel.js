// Load modules
const dbPool = require('./db');


async function loadChannels () {
    const [rows, fields] =  await dbPool.query('SELECT * FROM channels WHERE 1 ORDER BY name ASC', []);
    global.channels = rows;
    return rows;
}

async function loadChannel (searchId) {
    const [rows, fields] =  await dbPool.query('SELECT * FROM channels WHERE id = ? ', [parseInt(searchId)]);
    return rows[0];
}

function loadChannelByEntity (searchId) {
  var $channels = [];
  global.channels.forEach(function (item) {
    if (item.entity_id == searchId) {
      $channels.push(item);
    }
  });
  return $channels;
}

module.exports = {
  loadChannels: loadChannels,
  loadChannel: loadChannel,
  loadChannelByEntity: loadChannelByEntity,
    loadChannels:loadChannels
}