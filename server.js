'use strict';


const axios   = require('axios');
//const functions = require('firebase-functions'); // Cloud Functions for Firebase library
// const DialogflowApp = require('actions-on-google').DialogflowApp; // Google Assistant helper library
const http = require('http');
const mysql = require('mysql');
const https = require('https');
const express = require('express');
const port = process.env.PORT || 8080;
const dbUrl = process.env.CLEARDB_DATABASE_URL || 'mysql://root:mysql@localhost/openinghours?reconnect=true';
const bodyParser = require('body-parser');


var dbConnection = mysql.createConnection(dbUrl);

dbConnection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

var app = express();
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('json spaces', 40);

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)



//                 OPENINGSUREN
function formatDateFromJs(today){
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10) {
        dd = '0'+dd
    }

    if(mm<10) {
        mm = '0'+mm
    }
    return yyyy + '-' + mm + '-' + dd;
}

//                 OPENINGSUREN
function formatDateFromUnix(timestamp){
    var today = new Date(timestamp * 1000);
    return formatDateFromJs(today);
}

function transformQueryResultsToOrgChannelDaysOutput(results){
    var $days = {};
    results.forEach(function(item){
        if(typeof $days[item.organisation_id] == 'undefined') {
            $days[item.organisation_id] = {
                id: item.organisation_id,
                channels: {}
            };
        }
        if(typeof $days[item.organisation_id].channels[item.channel_id] == 'undefined') {
            $days[item.organisation_id].channels[item.channel_id] = {
                id: item.channel_id,
                days: {}
            };
        }
        var formattedDate = formatDateFromJs(item.day);
        console.log(formattedDate);
        if(typeof $days[item.organisation_id].channels[item.channel_id].days[formattedDate] == 'undefined') {
            $days[item.organisation_id].channels[item.channel_id].days[formattedDate] = [];
        }
        $days[item.organisation_id].channels[item.channel_id].days[formattedDate].push({from:item.start_hour,to:item.end_hour});
    });
    return $days;
}

function transformQueryResultsToChannelDaysOutput(results){
    var $days = {};
    results.forEach(function(item){

        if(typeof $days[item.channel_id] == 'undefined') {
            $days[item.channel_id] = { id: item.channel_id, days: {}};
        }
        if(typeof $days[item.channel_id].days[formatDateFromJs(item.day)] == 'undefined') {
            $days[item.channel_id].days[formatDateFromJs(item.day)] = [];
        }
        $days[item.channel_id].days[formatDateFromJs(item.day)].push({from:item.start_hour,to:item.end_hour});
    });
    return $days;
}

function transformQueryResultsToDaysOutput(results){
    var $days = {};
    results.forEach(function(item){
        //console.log(item);
        if(typeof $days[formatDateFromJs(item.day)] == 'undefined') {
            $days[formatDateFromJs(item.day)] = [];
        }
        $days[formatDateFromJs(item.day)].push({from:item.start_hour,to:item.end_hour});
    });
    return $days;
}


router.get('/openingsuren/:organisatie_id/:channel_id', function(req, res) {
    //req.params.organisatie_id
    var datetimeFrom = req.params.from || formatDateFromJs(new Date());
    var todate = new Date();
    todate.setDate(todate.getDate() + 7);
    var datetimeTo = req.params.to || formatDateFromJs(todate);

    // console.log(datetimeTo);
    // console.log(datetimeFrom);
    // console.log(req.params.organisatie_id);
    // console.log(req.params.channel_id);

    dbConnection.query('SELECT * ' +
        'FROM opening_hours ' +
        'WHERE organisation_id = ? ' +
        '   AND channel_id = ?' +
         '   AND day >= ?' +
         '   AND day <= ?' +
        ' ORDER BY day ASC, start_hour ASC',
        [
            req.params.organisatie_id,
            req.params.channel_id,
            datetimeFrom,
            datetimeTo
        ],
        function (error, results, fields) {
        //console.log(typeof error);
        if (!error) {
            var $days = transformQueryResultsToDaysOutput(results);
            //console.log($days);
            res.json({ days: $days });

        }
        // error will be an Error if one occurred during the query
        // results will contain the results of the query
        // fields will contain information about the returned results fields (if any)
    });
});
router.get('/openingsuren/:organisatie_id', function(req, res) {
    //req.params.organisatie_id
    var datetimeFrom = req.params.from || formatDateFromJs(new Date());
    var todate = new Date();
    todate.setDate(todate.getDate() + 7);
    var datetimeTo = req.params.to || formatDateFromJs(todate);

    // console.log(datetimeTo);
    // console.log(datetimeFrom);
    // console.log(req.params.organisatie_id);
    // console.log(req.params.channel_id);

    dbConnection.query('SELECT * ' +
        'FROM opening_hours ' +
        'WHERE organisation_id = ? ' +
        '   AND day >= ?' +
        '   AND day <= ?' +
        ' ORDER BY day ASC, start_hour ASC',
        [
            req.params.organisatie_id,
            datetimeFrom,
            datetimeTo
        ],
        function (error, results, fields) {
            //console.log(typeof error);
            if (!error) {
                var $channels = transformQueryResultsToChannelDaysOutput(results);
                //console.log($channels);
                res.json({ channels: $channels });

            }
            // error will be an Error if one occurred during the query
            // results will contain the results of the query
            // fields will contain information about the returned results fields (if any)
        });
});
router.get('/openingsuren', function(req, res) {
    var datetimeFrom = req.params.from || formatDateFromJs(new Date());
    var todate = new Date();
    todate.setDate(todate.getDate() + 7);
    var datetimeTo = req.params.to || formatDateFromJs(todate);

    // console.log(datetimeTo);
    // console.log(datetimeFrom);
    //console.log(req.params.organisatie_id);
    //console.log(req.params.channel_id);

    dbConnection.query('SELECT * ' +
        'FROM opening_hours ' +
        '   WHERE day >= ?' +
        '   AND day <= ?' +
        'ORDER BY day ASC, start_hour ASC',
        [
            datetimeFrom,
            datetimeTo
        ],
        function (error, results, fields) {
            //console.log(typeof error);
            if (!error) {
                var $channels = transformQueryResultsToOrgChannelDaysOutput(results);
                //console.log($channels);
                res.json({ organisations: $channels });

            }
            // error will be an Error if one occurred during the query
            // results will contain the results of the query
            // fields will contain information about the returned results fields (if any)
        });
});





//                  GEOPEND
router.get('/geopend/:organisatie_id/:channel_id', function(req, res) {
    //req.params.organisatie_id
    //req.params.channel_id
    //optionele url parameter: timestamp (toon status on timestamp).
    var datetime = req.params.timestamp || Math.floor(Date.now() / 1000);
    var huidigeDag = formatDateFromUnix(datetime);
    // console.log(datetime);
    // console.log(huidigeDag);
    // console.log(req.params.organisatie_id);
    // console.log(req.params.channel_id);
    dbConnection.query('SELECT count(id) as existing FROM opening_hours ' +
        'WHERE organisation_id = ?  AND channel_id = ?  AND day = ?  AND start_hour <= ?  AND end_hour >= ?',
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
            }else{
                //console.log('FOUND:');
                //console.log(results[0].existing);
                if(results[0].existing == 0){
                    //do nothing
                    $geopend = false;
                }
                if(results[0].existing == 1 || results[0].existing > 1) {
                    $geopend = true;
                }
            }
            res.json({ geopend: $geopend });
            // error will be an Error if one occurred during the query
            // results will contain the results of the query
            // fields will contain information about the returned results fields (if any)
        });
});


router.get('/geopend/:organisatie_id', function(req, res) {
    //req.params.organisatie_id
    //req.params.channel_id
    //optionele url parameter: timestamp (toon status on timestamp).

    //req.params.organisatie_id
    //req.params.channel_id
    //optionele url parameter: timestamp (toon status on timestamp).
    var datetime = req.params.timestamp || Math.floor(Date.now() / 1000);
    var huidigeDag = formatDateFromUnix(datetime);
    // console.log(datetime);
    // console.log(huidigeDag);
    // console.log(req.params.organisatie_id);
    // console.log(req.params.channel_id);
    dbConnection.query('SELECT  channel_id, count(id) as existing FROM opening_hours ' +
        'WHERE organisation_id = ? AND day = ?  AND start_hour <= ?  AND end_hour >= ? GROUP BY  channel_id',
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
            }else{
                // console.log('FOUND:');
                // console.log(results);
                var $outputArray = {};

                results.forEach(function(item){

                    if(typeof $outputArray[item.channel_id] == 'undefined') {
                        $outputArray[item.channel_id] = {
                            channel_id: item.channel_id,
                            geopend: (item.existing > 0)? true : false
                        };
                    }
                });
            }
            res.json({ channels: $outputArray });
            // error will be an Error if one occurred during the query
            // results will contain the results of the query
            // fields will contain information about the returned results fields (if any)
        });
});


//voor intern gebruik _ overzichtpagina
router.get('/geopend', function(req, res) {
    //req.params.organisatie_id
    //req.params.channel_id
    //optionele url parameter: timestamp (toon status on timestamp).
    //SELECT organisation_id , channel_id, count(id) as existing  FROM opening_hours WHERE day = '2017-12-10'  AND start_hour <= 1512915217 AND end_hour >= 1512915217 GROUP BY organisation_id, channel_id

    //req.params.organisatie_id
    //req.params.channel_id
    //optionele url parameter: timestamp (toon status on timestamp).
    var datetime = req.params.timestamp || Math.floor(Date.now() / 1000);
    var huidigeDag = formatDateFromUnix(datetime);
    // console.log(datetime);
    // console.log(huidigeDag);
    // console.log(req.params.organisatie_id);
    // console.log(req.params.channel_id);
    dbConnection.query('SELECT organisation_id , channel_id, count(id) as existing FROM opening_hours ' +
        'WHERE day = ?  AND start_hour <= ?  AND end_hour >= ? GROUP BY organisation_id, channel_id',
        [
            huidigeDag,
            datetime,
            datetime
        ],
        function (error, results) {
            var $geopend = false;
            if (error) {
                console.log(error);
            }else{
                // console.log('FOUND:');
                // console.log(results);
                var $outputArray = {};

                results.forEach(function(item){
                    if(typeof $outputArray[item.organisation_id] == 'undefined') {
                        $outputArray[item.organisation_id] = {organisation_id: item.organisation_id, channels: {}};
                    }
                    if(typeof $outputArray[item.organisation_id].channels[item.channel_id] == 'undefined') {
                        $outputArray[item.organisation_id].channels[item.channel_id] = {
                            channel_id: item.channel_id,
                            geopend: (item.existing > 0)? true : false
                        };
                    }
                });
            }
            res.json({ organisations: $outputArray });
            // error will be an Error if one occurred during the query
            // results will contain the results of the query
            // fields will contain information about the returned results fields (if any)
        });
});


router.get('/', function(req, res) {
    res.json({ message: 'OPENINGSUREN!',
                routes: router.stack
                });
});


// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api/v1', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);