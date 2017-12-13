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
}
module.exports = {
    formatDateFromJs: formatDateFromJs,
  formatDateFromUnix: function (timestamp) {
    var today = new Date(timestamp * 1000);
    return formatDateFromJs(today);
  },
  transformQueryResultsToOrgChannelDaysOutput: function (results) {
    var $days = {};
    results.forEach(function (item) {
      if (typeof $days[item.entity_id] == 'undefined') {
        $days[item.entity_id] = {
          id: item.entity_id,
          channels: {}
        };
      }
      if (typeof $days[item.entity_id].channels[item.channel_id] == 'undefined') {
        $days[item.entity_id].channels[item.channel_id] = {
          id: item.channel_id,
          days: {}
        };
      }
      var formattedDate = formatDateFromJs(item.day);
      console.log(formattedDate);
      if (typeof $days[item.entity_id].channels[item.channel_id].days[formattedDate] == 'undefined') {
        $days[item.entity_id].channels[item.channel_id].days[formattedDate] = [];
      }
      $days[item.entity_id].channels[item.channel_id].days[formattedDate].push({
        from: item.start_time,
        to: item.end_time
      });
    });
    return $days;
  },
  transformQueryResultsToChannelDaysOutput: function (results) {
    var $days = {};
    results.forEach(function (item) {

      if (typeof $days[item.channel_id] == 'undefined') {
        $days[item.channel_id] = {id: item.channel_id, days: {}};
      }
      if (typeof $days[item.channel_id].days[formatDateFromJs(item.day)] == 'undefined') {
        $days[item.channel_id].days[formatDateFromJs(item.day)] = [];
      }
      $days[item.channel_id].days[formatDateFromJs(item.day)].push({from: item.start_time, to: item.end_time});
    });
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