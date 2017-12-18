// Require modules
const express = require('express');
const helper = require('./../../controllers/helper');
const openingHour = require('./../../controllers/openingHour');
require('datejs');
var Q = require('q');
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

    var weekdays = {};
    var $startofweekString = req.query.week;
    var $startofweek = new Date($startofweekString);
    var formattedVandaag = new Date().toString('yyyy-MM-dd');
    var $startNextWeek = $startofweek.clone().add(7).days();
    console.log('$startofweek');
    console.log($startofweek);
    var $startPrevWeek =  $startofweek.clone().add(-7).days();
    ////// Calculate these two"//////
    var curWeekText = '';


    console.log('--------------------------------------------');
    var d = new Date;
    console.log(d.getDay());
    if(d.getDay() == 1) {
        var monday = Date.parse('today');
    }else{
        var monday = Date.today().last().monday()
    }
    if (monday.toString("M/d/yyyy")  == $startofweek.toString("M/d/yyyy")){
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


    Q.fcall(function(){
        //initialization

        weekdays = {
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
    })
    .then(function(){
        console.log('WEEKDAYS IS HERE:');
        getOpeningHoursInRange(curEntityId, curChannelId, $startofweek.set({ hour: 00, minute: 00 }),sunday.set({ hour: 23, minute: 59 })).then(function(results){

        });
    })
        // .then(function(){
        //     console.log('DO MONDAY');
        //     getOpeningHoursInRange(curEntityId, curChannelId, $startofweek.set({ hour: 00, minute: 00 }),sunday.set({ hour: 23, minute: 59 })).then(function(results){
        //
        //     });
        // })
    .then(function(results){
        results.forEach(function(slot){
            weekdays.forEach(function(weekday){
                if(slot.day == weekday.toString('yyyy-MM-dd')) {
                    weekday.slots.push(slot);
                }
            })
        });
    })
    // .then(promisedStep4)
    // .then(function (value4) {
    //     // Do something with value4
    // })
    .catch(function (error) {
        // Handle any error from all above steps
    })
    .done(function(){

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







//console.log(req);




});

protectedRouter.get('/insertTestData', function (req, res) {

    var $startofweek = new Date();
    var days = {};
    days.monday = $startofweek;
    days.tuesday = $startofweek.clone().add(1).days();
    days.wednesday = $startofweek.clone().add(2).days();
    days.thursday = $startofweek.clone().add(3).days();
    days.friday = $startofweek.clone().add(4).days();
    days.saturday = $startofweek.clone().add(5).days();
    days.sunday = $startofweek.clone().add(6).days();

    console.log(days);
    //for every day this week
    Object.keys(days).forEach(function(key){
        //select items for today
        var date = days[key];
        console.log(date);
        openingHour.getOpeningHoursOfDay(1,1,date, function(error, items){
            items.forEach(function(slot){
                console.log(slot);
                openingHour.deleteOpeningHour(slot.id, function(){
                    res.send('IT IS DELETED');
                });
            });

        });
        //create random new slots
        function random(start,limit) {
            return Math.floor(Math.random() * 6) + 1;
        }
        var amount = random(1,5);
        for(i = 0; i< amount; i++) {

            var startuur = random(0,12);//starting_hour
            var startmin = random(0,59);//starting_minute
            var d1 = date
                .set({ hour: startuur, minute: startmin });
            var duration = random(1,3) * 60;// (seconds)
            var d2 = d1.add({seconds: duration})
            var user_id = 1;
            openingHour.createOpeningsUur(1,1,date.toString('yyyy-MM-dd'), Math.floor(d1.getTime()/1000), Math.floor(d2.getTime()/1000),user_id, function(){
                res.send('IT IS CREATED');
            });

        }
    });


    console.log('DONE INSERTING');
});


protectedRouter.get('/channels', function (req, res) {

    // await Promise.all([
    //     c.execute('select * from channels where 1 order by name ASC'),
    //     c.execute('select sleep(2.5)')
    // ])
  res.render('channels',{
      channels: global.channels
  });
});
protectedRouter.get('/entities', function (req, res) {
  res.render('entities',{
      entities: global.entities
  });
});
protectedRouter.get('/login', function (req, res) {
  res.render('login');
});

// Export the router
module.exports = protectedRouter;