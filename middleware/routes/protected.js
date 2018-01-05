// Require modules
const express = require('express');
const openingHour = require('./../../controllers/openingHour');
const channel = require('./../../controllers/channel');
const entity = require('./../../controllers/entity');
const helper = require('./../../controllers/helper');
const dbPool = require('../../controllers/db');
const auth = require('./../../controllers/auth');
require('datejs');
//var Q = require('q');
// Setup router for protected routes
var protectedRouter = express.Router();

// HTML endpoints
protectedRouter.get('/', auth.authorize, async function (req, res) {
  //if param does not exist//
    try {
        var channels =  await channel.loadChannels();
        var entities = await entity.loadEntities();
    } catch (err) {
        console.error(err)
    }
    // console.log(channels[0].id);
    // console.log(entities[0].id);
    if (typeof req.query.week == 'undefined') {
        //$startofweek = this monday
        //redirect to this route with ?week=$startofweek
        res.writeHead(302, {
            'Location': '?entity='+entities[0].id+'&channel='+channels[0].id+'&week=' + helper.getMonday(new Date()).toString('yyyy-MM-dd')
            //add other headers here...
        });
        res.end();
        return ;
    }



    var weekdays = {};
    var $startofweekString = req.query.week;
    var $startofweek = new Date($startofweekString);
    var formattedVandaag = new Date().toString('yyyy-MM-dd');
    var $startNextWeek = $startofweek.clone().add(7).days();
    var $startPrevWeek =  $startofweek.clone().add(-7).days();
    ////// Calculate these two"//////
    var curWeekText = '';


    var d = new Date;

    if(d.getDay() == 1) {
        var monday = Date.parse('today');
    }else{
        var monday = Date.today().last().monday()
    }
    if (monday.toString("M/d/yyyy")  == $startofweek.toString("M/d/yyyy")){
        curWeekText = 'This week';
    } else {
        curWeekText = 'week ' + $startofweek.toString("d MMMM");
    }



    var curEntityId = req.query.entity || 1;
    var curChannelId = req.query.channel || 1;

    var monday = $startofweek.set({ hour: 0, minute: 0 });
    var tuesday = $startofweek.clone().add(1).days().set({ hour: 0, minute: 0 });

    var wednesday = $startofweek.clone().add(2).days().set({ hour: 0, minute: 0 });
    var thursday = $startofweek.clone().add(3).days().set({ hour: 0, minute: 0 });
    var friday = $startofweek.clone().add(4).days().set({ hour: 0, minute: 0 });
    var saturday = $startofweek.clone().add(5).days().set({ hour: 0, minute: 0 });
    var sunday = $startofweek.clone().add(6).days().set({ hour: 0, minute: 0 });
    try {
        var mondaySlots =  await openingHour.getOpeningHoursOfDay(curEntityId,curChannelId,monday);
        var tuesdayslots =  await openingHour.getOpeningHoursOfDay(curEntityId,curChannelId,tuesday);
        var wednesdayslots =  await openingHour.getOpeningHoursOfDay(curEntityId,curChannelId,wednesday);
        var thursdayslots =  await openingHour.getOpeningHoursOfDay(curEntityId,curChannelId,thursday);
        var fridayslots =  await openingHour.getOpeningHoursOfDay(curEntityId,curChannelId,friday);
        var saturdayslots =  await openingHour.getOpeningHoursOfDay(curEntityId,curChannelId,saturday);
        var sundayslots =  await openingHour.getOpeningHoursOfDay(curEntityId,curChannelId,sunday);
    } catch (err) {
        console.error(err)
    }

        //initialization

        weekdays = {
            monday:{
                date: $startofweek,
                formattedDate: monday.toString('dd MMMM'),
                title: "monday",
                slots: mondaySlots,
                vandaagClass: (Date.today().toString('yyyy-MM-dd') == monday.toString('yyyy-MM-dd'))?'vandaag': 'niet_vandaag',

            },
            tuesday:{
                formattedDate: tuesday.toString('dd MMMM'),
                date: tuesday,
                title: "tuesday",
                slots: tuesdayslots,
                vandaagClass: (Date.today().toString('yyyy-MM-dd') == tuesday.toString('yyyy-MM-dd'))?'vandaag': 'niet_vandaag'
            },
            wednesday:{
                formattedDate: wednesday.toString('dd MMMM'),
                date: wednesday,
                title: "wednesday",
                slots: wednesdayslots,
                vandaagClass: (Date.today().toString('yyyy-MM-dd') == wednesday.toString('yyyy-MM-dd'))?'vandaag': 'niet_vandaag'
            },
            thursday:{
                formattedDate: thursday.toString('dd MMMM'),
                date: thursday,
                title: "thursday",
                slots: thursdayslots,
                vandaagClass: (Date.today().toString('yyyy-MM-dd') == thursday.toString('yyyy-MM-dd'))?'vandaag': 'niet_vandaag'
            },
            friday:{
                formattedDate: friday.toString('dd MMMM'),
                date: friday,
                title: "friday",
                slots: fridayslots,
                vandaagClass: (Date.today().toString('yyyy-MM-dd') == friday.toString('yyyy-MM-dd'))?'vandaag': 'niet_vandaag'
            },
            saturday:{
                formattedDate: saturday.toString('dd MMMM'),
                date: saturday,
                title: "saturday",
                slots: saturdayslots,
                vandaagClass: (Date.today().toString('yyyy-MM-dd') == saturday.toString('yyyy-MM-dd'))?'vandaag': 'niet_vandaag'
            },
            sunday:{
                formattedDate: sunday.toString('dd MMMM'),
                date: sunday,
                title: "sunday",
                slots: sundayslots,
                vandaagClass: (Date.today().toString('yyyy-MM-dd') == sunday.toString('yyyy-MM-dd'))?'vandaag': 'niet_vandaag'

            }
        };
var strippedUrl = req.originalUrl.substring(0,req.originalUrl.indexOf('?'));
        var weekNav = {
            prevLink: '?week=' + $startPrevWeek.toString('yyyy-MM-dd') + '&entity=' + curEntityId + '&channel=' + curChannelId ,
            nextLink: '?week=' + $startNextWeek.toString('yyyy-MM-dd') + '&entity=' + curEntityId + '&channel=' + curChannelId,
            curWeekTextString: curWeekText,
            curWeekTimeString: $startofweekString,
            nextweekTimeString: $startNextWeek.toString('yyyy-MM-dd'),
            weekdays: weekdays,
            formattedVandaag: formattedVandaag,
            entities:entities,
            channels: channels,
            url:  req.originalUrl,
            week: req.query.week,
            curChannel: curChannelId,
            curEntity: curEntityId,
            strippedUrl: strippedUrl,
        };

        res.render('entry', weekNav);


});

protectedRouter.get('/insertTestData', auth.authorize, function (req, res) {

    var $startofweek = new Date();
    var days = {};
    days.monday = $startofweek;
    days.tuesday = $startofweek.clone().add(1).days();
    days.wednesday = $startofweek.clone().add(2).days();
    days.thursday = $startofweek.clone().add(3).days();
    days.friday = $startofweek.clone().add(4).days();
    days.saturday = $startofweek.clone().add(5).days();
    days.sunday = $startofweek.clone().add(6).days();

    //for every day this week
    Object.keys(days).forEach(function(key){
        //select items for today
        var date = days[key];

        openingHour.getOpeningHoursOfDay(1,1,date, function(error, items){
            items.forEach(function(slot){
                openingHour.deleteOpeningHour(slot.id);
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

});


protectedRouter.get('/open', auth.authorize,  async function (req, res) {
    try {
        var datetime = req.params.timestamp || Math.floor(Date.now() / 1000);
        var huidigeDag = helper.formatDateFromUnix(datetime);
        var channels = await channel.loadChannels();
        var entities = await entity.loadEntities();

        const [results, fields] = await dbPool.query('SELECT entity_id , channel_id, start_time,end_time  FROM opening_hours ' +
            'WHERE day = ?  AND start_time <= ?  AND end_time >= ? GROUP BY entity_id, channel_id',
            [
                huidigeDag,
                datetime,
                datetime
            ]);
        var $outputArray = {};

        await helper.asyncForEach(results, async (item) => {
            if (typeof $outputArray[item.entity_id] == 'undefined') {
            var entityObject =  await entity.loadEntity(item.entity_id);
            entityObject.channels = {};
            $outputArray[item.entity_id] = entityObject;
        }
        if (typeof $outputArray[item.entity_id].channels[item.channel_id] == 'undefined') {
            var channelObject = await channel.loadChannel(item.channel_id);
            channelObject.geopend = (item.existing > 0) ? true : false;
            item.start_time_object = new Date(item.start_time * 1000);
            item.end_time_object = new Date(item.end_time * 1000);
            channelObject.item = item;
            $outputArray[item.entity_id].channels[item.channel_id] = channelObject;
            console.log('prepopulating object array');
        }
    });
        res.render('openoverzicht',{
            entities: $outputArray
        });
    } catch (err) {
        console.error(err)
    }
});

protectedRouter.get('/channels',  auth.authorize, async function (req, res) {
    try {
        var channels =  await channel.loadChannels();

        for (var index in channels) {
            var channelItem = channels[index];
            channelItem.created_Date = new Date(channelItem.created * 1000);
        }
        res.render('channels',{
          channels: channels
        });
    } catch (err) {
        console.error(err)
    }
});
protectedRouter.post('/channels',  auth.authorize, async function (req, res) {
    try {
        console.log('creating/updating channel');
        var data = req.body;
        console.log(data);
        var channelId = channel.createChannel(data.channelName,req.session.user.id);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ success: (!!channelId)?'created':'could not create' }));
    } catch (err) {
        console.error(err)
    }
});
protectedRouter.post('/entities',  auth.authorize, async function (req, res) {
    try {
        console.log('creating/updating entity');
        var data = req.body;
        console.log(data);
        var entityId = entity.createEntity(data.entityName,data.entityReference,req.session.user.id);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ success: (!!entityId)?'created':'could not create' }));
    } catch (err) {
        console.error(err)
    }
});


protectedRouter.post('/emptychannel',  auth.authorize, async function (req, res) {
    try {
        var data = req.body;
        var startOfWeek = new Date(data.week).set({ hour: 0, minute: 0 });
        var endOfWeek  = new Date(data.week).add(7).days().set({ hour: 0, minute: 0 });
        console.log(startOfWeek);
        console.log(endOfWeek);
        var slots = await openingHour.getOpeningHoursInRange(data.entity, data.channel, Math.floor(startOfWeek.getTime()/1000), Math.floor(endOfWeek.getTime()/1000));
        var count = 0;
        for(index in slots) {
            var slot = slots[index];
            var result = await openingHour.deleteOpeningHour(slot.id);
            count ++;
        }
        res.redirect(data.fromUrl);
        //redirect back.
    } catch (err) {
        console.error(err)
    }
});


protectedRouter.delete('/openinghours/:id',  auth.authorize, async function (req, res) {
    try {
        var status =  await openingHour.deleteOpeningHour(req.params.id);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ success: (!!status)?'deleted':'did not exist' }));
    } catch (err) {
        console.error(err)
    }
});

protectedRouter.delete('/channels/:id',  auth.authorize, async function (req, res) {
    try {
        var success = await channel.deleteChannel(req.params.id);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ success: (!!success)?'deleted':'did not exist' }));
    } catch (err) {
        console.error(err)
    }
});

protectedRouter.put('/channels/:id',  auth.authorize, async function (req, res) {
    try {
        var data = req.body;
        var success = await channel.updateChannel(req.params.id, data.fieldName, data.fieldValue);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ success: (!!success)?'deleted':'did not exist' }));
    } catch (err) {
        console.error(err)
    }
});

protectedRouter.delete('/entities/:id',  auth.authorize, async function (req, res) {
    try {
        var success = await entity.deleteEntity(req.params.id);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ success: (!!success)?'deleted':'did not exist' }));
    } catch (err) {
        console.error(err)
    }
});



// protectedRouter.post('/channel',  auth.authorize, async function (req, res) {
//
// });
protectedRouter.post('/openinghours',  auth.authorize, async function (req, res) {
    try {
        var oh = req.body;
        //transform start_time to UNIX timestamp
        //transform end_time to unix timestamp
        //var startTime = var birthDayParty = {month: 1, day: 20, hour: 20, minute: 30};
        var day = new Date(oh.day);
        var startTime = Date.today().set({
            month: parseInt(day.toString('MM') - 1),
            day: parseInt(day.toString('dd')),
            year: parseInt(day.toString('yyyy')),
            hour: parseInt(oh.start_time.substr(0,2)),
            minute: parseInt(oh.start_time.substr(3,2))
        });
        var endTime = Date.today().set({
            month: parseInt(day.toString('MM')- 1),
            day: parseInt(day.toString('dd')),
            year: parseInt(day.toString('yyyy')),
            hour: parseInt(oh.end_time.substr(0,2)),
            minute: parseInt(oh.end_time.substr(3,2))
        });

         var id =  await openingHour.createOpeningsUur(oh.entity_id,oh.channel_id,oh.day, startTime.getTime() / 1000, endTime.getTime() / 1000);
        // var status =  await openingHour.deleteOpeningHour(req.params.id);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ created: (!!id)?id:false }));
    } catch (err) {
        console.error(err)
    }
});


protectedRouter.get('/entities',auth.authorize,  async function (req, res) {
    try {
        var entities =  await entity.loadEntities();
        for (var index in entities) {
            var entityItem = entities[index];
            entityItem.created_Date = new Date(entityItem.created * 1000);
        }
        res.render('entities',{
            entities: entities
        });
    } catch (err) {
        console.error(err)
    }
});

protectedRouter.get('/login', function (req, res) {
  res.render('login');
});

// Export the router
module.exports = protectedRouter;