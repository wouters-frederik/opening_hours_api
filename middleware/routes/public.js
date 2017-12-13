// Require modules
const express = require('express');
const helper = require('./../../controllers/helper');
const dbPool = require('../../controllers/db');

// Setup router for public
var router = express.Router();              // get an instance of the express Router

router.get('/openinghours/:organisatie_id/:channel_id', function (req, res) {
  //req.params.organisatie_id
  var datetimeFrom = req.params.from || helper.formatDateFromJs(new Date());
  var todate = new Date();
  todate.setDate(todate.getDate() + 7);
  var datetimeTo = req.params.to || helper.formatDateFromJs(todate);

  // console.log(datetimeTo);
  // console.log(datetimeFrom);
  // console.log(req.params.organisatie_id);
  // console.log(req.params.channel_id);

  dbPool.query('SELECT * ' +
    'FROM opening_hours ' +
    'WHERE organisation_id = ? ' +
    '   AND channel_id = ?' +
    '   AND day >= ?' +
    '   AND day <= ?' +
    ' ORDER BY day ASC, start_time ASC',
    [
      req.params.organisatie_id,
      req.params.channel_id,
      datetimeFrom,
      datetimeTo
    ],
    function (error, results, fields) {
      //console.log(typeof error);
      if (!error) {
        var $days = helper.transformQueryResultsToDaysOutput(results);
        //console.log($days);
        res.json({days: $days});

      }
      // error will be an Error if one occurred during the query
      // results will contain the results of the query
      // fields will contain information about the returned results fields (if any)
    });
});
router.get('/openinghours/:organisatie_id', function (req, res) {
  //req.params.organisatie_id
  var datetimeFrom = req.params.from || helper.formatDateFromJs(new Date());
  var todate = new Date();
  todate.setDate(todate.getDate() + 7);
  var datetimeTo = req.params.to || helper.formatDateFromJs(todate);

  // console.log(datetimeTo);
  // console.log(datetimeFrom);
  // console.log(req.params.organisatie_id);
  // console.log(req.params.channel_id);

  dbPool.query('SELECT * ' +
    'FROM opening_hours ' +
    'WHERE organisation_id = ? ' +
    '   AND day >= ?' +
    '   AND day <= ?' +
    ' ORDER BY day ASC, start_time ASC',
    [
      req.params.organisatie_id,
      datetimeFrom,
      datetimeTo
    ],
    function (error, results, fields) {
      //console.log(typeof error);
      if (!error) {
        var $channels = helper.transformQueryResultsToChannelDaysOutput(results);
        //console.log($channels);
        res.json({channels: $channels});

      }
      // error will be an Error if one occurred during the query
      // results will contain the results of the query
      // fields will contain information about the returned results fields (if any)
    });
});
router.get('/openinghours', function (req, res) {
  var datetimeFrom = req.params.from || helper.formatDateFromJs(new Date());
  var todate = new Date();
  todate.setDate(todate.getDate() + 7);
  var datetimeTo = req.params.to || helper.formatDateFromJs(todate);

  // console.log(datetimeTo);
  // console.log(datetimeFrom);
  //console.log(req.params.organisatie_id);
  //console.log(req.params.channel_id);

  dbPool.query('SELECT * ' +
    'FROM opening_hours ' +
    '   WHERE day >= ?' +
    '   AND day <= ?' +
    'ORDER BY day ASC, start_time ASC',
    [
      datetimeFrom,
      datetimeTo
    ],
    function (error, results, fields) {
      //console.log(typeof error);
      if (!error) {
        var $channels = helper.transformQueryResultsToOrgChannelDaysOutput(results);
        //console.log($channels);
        res.json({organisations: $channels});

      }
      // error will be an Error if one occurred during the query
      // results will contain the results of the query
      // fields will contain information about the returned results fields (if any)
    });
});

//////////////////// OPEN ROUTES
//                  GEOPEND
router.get('/open/:organisatie_id/:channel_id', function (req, res) {
  //req.params.organisatie_id
  //req.params.channel_id
  //optionele url parameter: timestamp (toon status on timestamp).
  var datetime = req.params.timestamp || Math.floor(Date.now() / 1000);
  var huidigeDag = helper.formatDateFromUnix(datetime);
  // console.log(datetime);
  // console.log(huidigeDag);
  // console.log(req.params.organisatie_id);
  // console.log(req.params.channel_id);
  dbPool.query('SELECT count(id) as existing FROM opening_hours ' +
    'WHERE organisation_id = ?  AND channel_id = ?  AND day = ?  AND start_time <= ?  AND end_time >= ?',
    [
      req.params.organisatie_id,
      req.params.channel_id,
      huidigeDag,
      datetime,
      datetime
    ],
    function (error, results) {
      var $geopend = false;
      if (error) {
        //console.log(error);
      } else {
        //console.log('FOUND:');
        //console.log(results[0].existing);
        if (results[0].existing == 0) {
          //do nothing
          $geopend = false;
        }
        if (results[0].existing == 1 || results[0].existing > 1) {
          $geopend = true;
        }
      }
      res.json({geopend: $geopend});
      // error will be an Error if one occurred during the query
      // results will contain the results of the query
      // fields will contain information about the returned results fields (if any)
    });
});

router.get('/open/:organisatie_id', function (req, res) {
  //req.params.organisatie_id
  //req.params.channel_id
  //optionele url parameter: timestamp (toon status on timestamp).

  //req.params.organisatie_id
  //req.params.channel_id
  //optionele url parameter: timestamp (toon status on timestamp).
  var datetime = req.params.timestamp || Math.floor(Date.now() / 1000);
  var huidigeDag = helper.formatDateFromUnix(datetime);
  // console.log(datetime);
  // console.log(huidigeDag);
  // console.log(req.params.organisatie_id);
  // console.log(req.params.channel_id);
  dbPool.query('SELECT  channel_id, count(id) as existing FROM opening_hours ' +
    'WHERE organisation_id = ? AND day = ?  AND start_time <= ?  AND end_time >= ? GROUP BY  channel_id',
    [
      req.params.organisatie_id,
      huidigeDag,
      datetime,
      datetime
    ],
    function (error, results) {
      var $geopend = false;
      if (error) {
        console.log(error);
      } else {
        // console.log('FOUND:');
        // console.log(results);
        var $outputArray = {};

        results.forEach(function (item) {

          if (typeof $outputArray[item.channel_id] == 'undefined') {
            $outputArray[item.channel_id] = {
              channel_id: item.channel_id,
              geopend: (item.existing > 0) ? true : false
            };
          }
        });
      }
      res.json({channels: $outputArray});
      // error will be an Error if one occurred during the query
      // results will contain the results of the query
      // fields will contain information about the returned results fields (if any)
    });
});

//voor intern gebruik _ overzichtpagina
router.get('/open', function (req, res) {
  //req.params.organisatie_id
  //req.params.channel_id
  //optionele url parameter: timestamp (toon status on timestamp).
  //SELECT organisation_id , channel_id, count(id) as existing  FROM opening_hours WHERE day = '2017-12-10'  AND start_time <= 1512915217 AND end_time >= 1512915217 GROUP BY organisation_id, channel_id

  //req.params.organisatie_id
  //req.params.channel_id
  //optionele url parameter: timestamp (toon status on timestamp).
  var datetime = req.params.timestamp || Math.floor(Date.now() / 1000);
  var huidigeDag = helper.formatDateFromUnix(datetime);
  // console.log(datetime);
  // console.log(huidigeDag);
  // console.log(req.params.organisatie_id);
  // console.log(req.params.channel_id);
  dbPool.query('SELECT organisation_id , channel_id, count(id) as existing FROM opening_hours ' +
    'WHERE day = ?  AND start_time <= ?  AND end_time >= ? GROUP BY organisation_id, channel_id',
    [
      huidigeDag,
      datetime,
      datetime
    ],
    function (error, results) {
      var $geopend = false;
      if (error) {
        console.log(error);
      } else {
        // console.log('FOUND:');
        // console.log(results);
        var $outputArray = {};

        results.forEach(function (item) {
          if (typeof $outputArray[item.organisation_id] == 'undefined') {
            $outputArray[item.organisation_id] = {organisation_id: item.organisation_id, channels: {}};
          }
          if (typeof $outputArray[item.organisation_id].channels[item.channel_id] == 'undefined') {
            $outputArray[item.organisation_id].channels[item.channel_id] = {
              channel_id: item.channel_id,
              geopend: (item.existing > 0) ? true : false
            };
          }
        });
      }
      res.json({organisations: $outputArray});
      // error will be an Error if one occurred during the query
      // results will contain the results of the query
      // fields will contain information about the returned results fields (if any)
    });
});

//voor intern gebruik _ overzichtpagina
router.get('/organisations', function (req, res) {

  res.json({organisations: global.organisations});

});
router.get('/organisations/:organisation_id', function (req, res) {
  var $organisation = loadOrganisation(req.params.organisation_id);
  console.log($organisation);
  res.json({organisation: $organisation});

});

//voor intern gebruik _ overzichtpagina
router.get('/channels', function (req, res) {

  res.json({channels: global.channels});

});

router.get('/', function (req, res) {
  res.json({
    message: 'OPENINGSUREN!',
    routes: router.stack
  });
});

// Export the router
module.exports = router;