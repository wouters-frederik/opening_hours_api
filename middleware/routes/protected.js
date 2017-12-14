// Require modules
const express = require('express');
const helper = require('./../../controllers/helper');
require('datejs');
// Setup router for protected routes
var protectedRouter = express.Router();

// HTML endpoints
protectedRouter.get('/', function (req, res) {
  //if param does not exist//
    console.log(req.query);
    if (typeof req.query.week == 'undefined') {
        //$startofweek = this monday
        //redirect to this route with ?week=$startofweek
        res.writeHead(302, {
            'Location': '?week=' + helper.getMonday(new Date()).toISOString()
            //add other headers here...
        });
        res.end();
    }

    var $startofweekString = req.query.week;
    var $startofweek = new Date($startofweekString);
    var formattedVandaag = new Date().toString('yyyy-MM-dd');
    var $startNextWeek = $startofweek.clone().add(7).days();
    console.log('$startofweek');
    console.log($startofweek);
    var $startPrevWeek =  $startofweek.clone().add(-7).days();
    ////// Calculate these two"//////
    var curWeekText = '';

    if (Date.parse("last monday").toString("M/d/yyyy")  == $startofweek.toString("M/d/yyyy")){
        curWeekText = 'Deze week';
    } else {
        curWeekText = 'De week van ' + $startofweek.toString("d MMMM");
    }

    console.log('================================');
    console.log(req.query.entity);
    console.log(req.query.channel);

    var curEntityId = req.query.entity || 1;
    var curChannelId = req.query.channel || 1;
    var monday = $startofweek;
    var tuesday = $startofweek.clone().add(1).days();
    var wednesday = $startofweek.clone().add(2).days();
    var thursday = $startofweek.clone().add(3).days();
    var friday = $startofweek.clone().add(4).days();
    var saturday = $startofweek.clone().add(5).days();
    var sunday = $startofweek.clone().add(6).days();

    var weekdays = {
        monday:{
            date: $startofweek,
            formattedDate: monday.toString('yyyy-MM-dd'),
            title: "monday",
            vandaagClass: (Date.today().toString('yyyy-MM-dd') == monday.toString('yyyy-MM-dd'))?'vandaag': 'niet_vandaag'
        },
        tuesday:{
            formattedDate: tuesday.toString('yyyy-MM-dd'),
            date: tuesday,
            title: "tuesday",
            vandaagClass: (Date.today().toString('yyyy-MM-dd') == tuesday.toString('yyyy-MM-dd'))?'vandaag': 'niet_vandaag'
        },
        wednesday:{
            formattedDate: wednesday.toString('yyyy-MM-dd'),
            date: wednesday,
            title: "wednesday",
            vandaagClass: (Date.today().toString('yyyy-MM-dd') == wednesday.toString('yyyy-MM-dd'))?'vandaag': 'niet_vandaag'
        },
        thursday:{
            formattedDate: thursday.toString('yyyy-MM-dd'),
            date: thursday,
            title: "thursday",
            vandaagClass: (Date.today().toString('yyyy-MM-dd') == thursday.toString('yyyy-MM-dd'))?'vandaag': 'niet_vandaag'
        },
        friday:{
            formattedDate: friday.toString('yyyy-MM-dd'),
            date: friday,
            title: "friday",
            vandaagClass: (Date.today().toString('yyyy-MM-dd') == friday.toString('yyyy-MM-dd'))?'vandaag': 'niet_vandaag'
        },
        saturday:{
            formattedDate: saturday.toString('yyyy-MM-dd'),
            date: saturday,
            title: "saturday",
            vandaagClass: (Date.today().toString('yyyy-MM-dd') == saturday.toString('yyyy-MM-dd'))?'vandaag': 'niet_vandaag'
        },
        sunday:{
            formattedDate: sunday.toString('yyyy-MM-dd'),
            date: sunday,
            title: "sunday",
            vandaagClass: (Date.today().toString('yyyy-MM-dd') == sunday.toString('yyyy-MM-dd'))?'vandaag': 'niet_vandaag'

        }
        };


//console.log(req);

        var weekNav = {
          prevLink: '?week=' + $startPrevWeek.toISOString() + '&entity=' + curEntityId + '&channel=' + curChannelId ,
          nextLink: '?week=' + $startNextWeek.toISOString() + '&entity=' + curEntityId + '&channel=' + curChannelId,
            curWeekTextString: curWeekText,
            weekdays: weekdays,
            formattedVandaag: formattedVandaag,
            entities:global.entities,
            channels: global.channels,
            url:  req.originalUrl,
            week: req.query.week,
            curChannel: curChannelId,
            curEntity: curEntityId

        };
        console.log(weekNav);
        res.render('entry', weekNav);


});


protectedRouter.get('/channels', function (req, res) {
  res.render('channels');
});
protectedRouter.get('/entities', function (req, res) {
  res.render('entities');
});
protectedRouter.get('/login', function (req, res) {
  res.render('login');
});

// Export the router
module.exports = protectedRouter;