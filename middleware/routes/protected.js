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
    }else{
        var $startofweekString = req.query.week;

        var $startofweek = new Date($startofweekString);

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
        var weekdays = {
            monday:{
                date: $startofweek,
                formattedDate: $startofweek.toString('yyyy-MM-dd'),
                title: "monday"
            },
            tuesday:{
                formattedDate: $startofweek.clone().add(1).days().toString('yyyy-MM-dd'),
                date: $startofweek.clone().add(1).days(),
                title: "tuesday"
            },
            wednesday:{
                formattedDate: $startofweek.clone().add(2).days().toString('yyyy-MM-dd'),
                date: $startofweek.clone().add(2).days(),
                title: "wednesday"
            },
            thursday:{
                formattedDate: $startofweek.clone().add(3).days().toString('yyyy-MM-dd'),
                date: $startofweek.clone().add(3).days(),
                title: "thursday"
            },
            friday:{
                formattedDate: $startofweek.clone().add(3).days().toString('yyyy-MM-dd'),
                date: $startofweek.clone().add(3).days(),
                title: "friday"
            },
            saturday:{
                formattedDate: $startofweek.clone().add(3).days().toString('yyyy-MM-dd'),
                date: $startofweek.clone().add(3).days(),
                title: "saturday"
            },
            sunday:{
                formattedDate: $startofweek.clone().add(3).days().toString('yyyy-MM-dd'),
                date: $startofweek.clone().add(3).days(),
                title: "sunday"
            }
        };
        var weekNav = {
          prevLink: '?week=' + $startPrevWeek.toISOString(),
          nextLink: '?week=' + $startNextWeek.toISOString(),
            curWeekTextString: curWeekText,
            weekdays: weekdays

        };
        console.log(weekNav);
        res.render('entry', weekNav);
    }






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