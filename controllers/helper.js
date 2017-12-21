
const entity = require('./entity');
const channel = require('./channel');

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
    }
}

formatDateFromJs =  function (today) {
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd
    }

    if (mm < 10) {
        mm = '0' + mm
    }
    return yyyy + '-' + mm + '-' + dd;
};

function subtractDays(date, numDays) {
    var res = date.setTime(date.getTime() - (numDays * 24 * 60 * 60 * 1000));
    return new Date(res);
}
function addDays(date, numDays) {
    var res = date.setTime(date.getTime() + (numDays * 24 * 60 * 60 * 1000));
    return new Date(res);
}
function getMonday(d) {
    var day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
    return new Date(d.setDate(diff));
}

module.exports = {
    formatDateFromJs: formatDateFromJs,
    addDays:addDays,
    subtractDays:subtractDays,
    getMonday:getMonday,
  formatDateFromUnix: function (timestamp) {
    var today = new Date(timestamp * 1000);
    return formatDateFromJs(today);
  },

  transformQueryResultsToOrgChannelDaysOutput: async function (results) {
    var $days = {};
    for (let item of results){
      if (typeof $days[item.entity_id] == 'undefined') {
          var entityObject =  await entity.loadEntity(item.entity_id);
          entityObject.channels = {};
        $days[item.entity_id] = entityObject;
      }

      if (typeof $days[item.entity_id].channels[item.channel_id] == 'undefined') {
          var channelObject =  await channel.loadChannel(item.channel_id);
          channelObject.days = {};
          $days[item.entity_id].channels[item.channel_id] = channelObject;
      }

      var formattedDate = formatDateFromJs(item.day);
      if (typeof $days[item.entity_id].channels[item.channel_id].days[formattedDate] == 'undefined') {
        $days[item.entity_id].channels[item.channel_id].days[formattedDate] = [];
      }

      $days[item.entity_id].channels[item.channel_id].days[formattedDate].push({
        from: item.start_time,
        to: item.end_time
      });

    }
    return $days;
  },


  transformQueryResultsToChannelDaysOutput: async function (results) {
    var $days = {};
    console.log('transformQueryResultsToChannelDaysOutput');
        await asyncForEach(results, async function(item){
          if (typeof $days[item.channel_id] == 'undefined') {
            var channelObject =  await channel.loadChannel(item.channel_id);
            channelObject.days = {};
            $days[item.channel_id] = channelObject;
          }
          var formatted = formatDateFromJs(item.day);
          if (typeof $days[item.channel_id].days[formatted] == 'undefined') {
            $days[item.channel_id].days[formatted] = [];
          }
          $days[item.channel_id].days[formatted].push({from: item.start_time, to: item.end_time});
    });

    console.log('$days');
    console.log($days);
    return $days;
  },

  transformQueryResultsToDaysOutput: function transformQueryResultsToDaysOutput (results) {
    var $days = {};
    results.forEach(function (item) {
      //console.log(item);
      if (typeof $days[formatDateFromJs(item.day)] == 'undefined') {
        $days[formatDateFromJs(item.day)] = [];
      }
      $days[formatDateFromJs(item.day)].push({from: item.start_time, to: item.end_time});
    });
    return $days;
  }
};