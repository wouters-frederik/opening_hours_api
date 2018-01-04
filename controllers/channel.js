// Load modules
const dbPool = require('./db');

async function createChannel (name,user_id) {
    const [results, fields] = await dbPool.query('INSERT into channels (`name`, `created`, `created_by`) VALUES (?,?,?)', [
        name,Math.floor(new Date().getTime()/1000),user_id
    ]);
    return results.insertId;
}

async function loadChannels () {
    const [rows, fields] =  await dbPool.query('SELECT channels.* , users.name as user_name FROM channels, users WHERE channels.created_by = users.id ORDER BY name ASC', []);
    global.channels = rows;
    return rows;
}

async function loadChannel (searchId) {
    const [rows, fields] =  await dbPool.query('SELECT channels.* , users.name as user_name FROM channels, users WHERE channels.created_by = users.id and channels.id = ?', [parseInt(searchId)]);
    return rows[0];
}
async function deleteChannel (searchId) {
    console.log('deleting');
    var res = await dbPool.query('DELETE FROM channels WHERE id = ? ', [parseInt(searchId)]);
    console.log('done');
    return true;
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
    loadChannels:loadChannels,
    deleteChannel:deleteChannel,
    createChannel:createChannel,
}