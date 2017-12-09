'use strict';


const axios   = require('axios');
//const functions = require('firebase-functions'); // Cloud Functions for Firebase library
// const DialogflowApp = require('actions-on-google').DialogflowApp; // Google Assistant helper library
const http = require('http');
const https = require('https');
const express = require('express');
const port = process.env.PORT || 8080;
const bodyParser = require('body-parser')

var app = express();
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)



//                 OPENINGSUREN


router.get('/openingsuren/:organisatie_id/:channel_id', function(req, res) {
    //req.params.organisatie_id
    //req.params.channel_id
    res.json({ message: 'show array of openingsuren for org/channel next 7 days (?from=&to=' });
});
router.get('/openingsuren/:organisatie_id', function(req, res) {
    //req.params.organisatie_id
    res.json({ message: 'show array of all channels for organisation' });
});
router.get('/openingsuren', function(req, res) {
    //req.params.organisatie_id
    res.json({ message: 'show array of all channels for all organisations' });
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