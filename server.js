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
const bodyParser = require('body-parser')


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
function formatDate(today){
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

function transformQueryResultsToOrgChannelDaysOutput(results){
    var $days = {};
    results.forEach(function(item){
        console.log(item);
        if(typeof $days[item.organisation_id] == 'undefined') {
            $days[item.organisation_id] = {
                id: item.organisation_id,
                channels: {}
            };
        }
        if(typeof $days[item.organisation_id].channels[item.channel_id] == 'undefined') {
            $days[item.organisation_id].channels[item.channel_id] = {
                id: item.channel_id,
                dates: {}
            };
        }
        var formattedDate = formatDate(item.day);
        console.log(formattedDate);
        if(typeof $days[item.organisation_id].channels[item.channel_id].dates[formattedDate] == 'undefined') {
            $days[item.organisation_id].channels[item.channel_id].dates[formattedDate] = [];
        }
        $days[item.organisation_id].channels[item.channel_id].dates[formattedDate].push({from:item.start_hour,to:item.end_hour});
    });
    return $days;
}

function transformQueryResultsToChannelDaysOutput(results){
    var $days = {};
    results.forEach(function(item){
        //console.log(item);
        if(typeof $days[item.channel_id] == 'undefined') {
            $days[item.channel_id] = {};
        }
        if(typeof $days[item.channel_id][formatDate(item.day)] == 'undefined') {
            $days[item.channel_id][formatDate(item.day)] = [];
        }
        $days[item.channel_id][formatDate(item.day)].push({from:item.start_hour,to:item.end_hour});
    });
    return $days;
}

function transformQueryResultsToDaysOutput(results){
    var $days = {};
    results.forEach(function(item){
        //console.log(item);
        if(typeof $days[formatDate(item.day)] == 'undefined') {
            $days[formatDate(item.day)] = [];
        }
        $days[formatDate(item.day)].push({from:item.start_hour,to:item.end_hour});
    });
    return $days;
}


router.get('/openingsuren/:organisatie_id/:channel_id', function(req, res) {
    //req.params.organisatie_id
    var datetimeFrom = req.params.from || formatDate(new Date());
    var todate = new Date();
    todate.setDate(todate.getDate() + 7);
    var datetimeTo = req.params.to || formatDate(todate);

    console.log(datetimeTo);
    console.log(datetimeFrom);
    console.log(req.params.organisatie_id);
    console.log(req.params.channel_id);

    dbConnection.query('SELECT * ' +
        'FROM opening_hours ' +
        'WHERE organisation_id = ? ' +
        '   AND channel_id = ?' +
         '   AND day >= ?' +
         '   AND day <= ?',
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
            console.log($days);
            res.json({ days: $days });

        }
        // error will be an Error if one occurred during the query
        // results will contain the results of the query
        // fields will contain information about the returned results fields (if any)
    });
});
router.get('/openingsuren/:organisatie_id', function(req, res) {
    //req.params.organisatie_id
    var datetimeFrom = req.params.from || formatDate(new Date());
    var todate = new Date();
    todate.setDate(todate.getDate() + 7);
    var datetimeTo = req.params.to || formatDate(todate);

    console.log(datetimeTo);
    console.log(datetimeFrom);
    console.log(req.params.organisatie_id);
    console.log(req.params.channel_id);

    dbConnection.query('SELECT * ' +
        'FROM opening_hours ' +
        'WHERE organisation_id = ? ' +
        '   AND day >= ?' +
        '   AND day <= ?',
        [
            req.params.organisatie_id,
            datetimeFrom,
            datetimeTo
        ],
        function (error, results, fields) {
            //console.log(typeof error);
            if (!error) {
                var $channels = transformQueryResultsToChannelDaysOutput(results);
                console.log($channels);
                res.json({ channels: $channels });

            }
            // error will be an Error if one occurred during the query
            // results will contain the results of the query
            // fields will contain information about the returned results fields (if any)
        });
});
router.get('/openingsuren', function(req, res) {
    var datetimeFrom = req.params.from || formatDate(new Date());
    var todate = new Date();
    todate.setDate(todate.getDate() + 7);
    var datetimeTo = req.params.to || formatDate(todate);

    console.log(datetimeTo);
    console.log(datetimeFrom);
    //console.log(req.params.organisatie_id);
    //console.log(req.params.channel_id);

    dbConnection.query('SELECT * ' +
        'FROM opening_hours ' +
        '   WHERE day >= ?' +
        '   AND day <= ?',
        [
            datetimeFrom,
            datetimeTo
        ],
        function (error, results, fields) {
            //console.log(typeof error);
            if (!error) {
                var $channels = transformQueryResultsToOrgChannelDaysOutput(results);
                console.log($channels);
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
    res.json({ message: 'toon indien geopend status (voor org & channel) ' });
});

//voor intern gebruik _ overzichtpagina
router.get('/geopend', function(req, res) {
    //req.params.organisatie_id
    //req.params.channel_id
    //optionele url parameter: timestamp (toon status on timestamp).
    res.json({ message: 'show array of organisaties, kanalen en hun geopend status (voor org' });
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