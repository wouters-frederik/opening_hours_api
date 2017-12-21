// Require modules
const express = require('express');
const dbPool = require('../../controllers/db');
const entity = require('../../controllers/entity');
const channel = require('../../controllers/channel');
const helper = require('./../../controllers/helper');
// Setup router for public
var router = express.Router();              // get an instance of the express Router





router.get('/openinghours/:entity_id/:channel_id', async function (req, res) {
    //req.params.entity_id
    var datetimeFrom = req.params.from || helper.formatDateFromJs(new Date());
    var todate = new Date();
    todate.setDate(todate.getDate() + 7);
    var datetimeTo = req.params.to || helper.formatDateFromJs(todate);
    const [results, fields] = await
    dbPool.query('SELECT * ' +
        'FROM opening_hours ' +
        'WHERE entity_id = ? ' +
        '   AND channel_id = ?' +
        '   AND day >= ?' +
        '   AND day <= ?' +
        ' ORDER BY day ASC, start_time ASC',
        [
            req.params.entity_id,
            req.params.channel_id,
            datetimeFrom,
            datetimeTo
        ]);
    var $days = helper.transformQueryResultsToDaysOutput(results);
    res.json({days: $days});
}
)
;

router.get('/openinghours/:entity_id', async function (req, res) {
    //req.params.entity_id
    var datetimeFrom = req.params.from || helper.formatDateFromJs(new Date());
    var todate = new Date();
    todate.setDate(todate.getDate() + 7);
    var datetimeTo = req.params.to || helper.formatDateFromJs(todate);
    const [results, fields] = await
    dbPool.query('SELECT * ' +
        'FROM opening_hours ' +
        'WHERE entity_id = ? ' +
        '   AND day >= ?' +
        '   AND day <= ?' +
        ' ORDER BY day ASC, start_time ASC',
        [
            req.params.entity_id,
            datetimeFrom,
            datetimeTo
        ]);
    var $channels = await helper.transformQueryResultsToChannelDaysOutput(results);
    res.json({channels: $channels});
}
)
;
router.get('/openinghours', async function (req, res) {
    var datetimeFrom = req.params.from || helper.formatDateFromJs(new Date());
    var todate = new Date();
    todate.setDate(todate.getDate() + 7);
    var datetimeTo = req.params.to || helper.formatDateFromJs(todate);

    const [results, fields] = await
    dbPool.query('SELECT * ' +
        'FROM opening_hours ' +
        '   WHERE day >= ?' +
        '   AND day <= ?' +
        'ORDER BY day ASC, start_time ASC',
        [
            datetimeFrom,
            datetimeTo
        ]);
    var $channels = await helper.transformQueryResultsToOrgChannelDaysOutput(results);
    res.json({entities: $channels});
}
)
;

//////////////////// OPEN ROUTES
//                  GEOPEND
router.get('/open/:entity_id/:channel_id', async function (req, res) {
    //req.params.entity_id
    //req.params.channel_id
    //optionele url parameter: timestamp (toon status on timestamp).
    var datetime = req.params.timestamp || Math.floor(Date.now() / 1000);
    var huidigeDag = helper.formatDateFromUnix(datetime);
    // console.log(datetime);
    // console.log(huidigeDag);
    // console.log(req.params.entity_id);
    // console.log(req.params.channel_id);
    const [results,fields] = await dbPool.query('SELECT count(id) as existing FROM opening_hours ' +
        'WHERE entity_id = ?  AND channel_id = ?  AND day = ?  AND start_time <= ?  AND end_time >= ?',
        [
            req.params.entity_id,
            req.params.channel_id,
            huidigeDag,
            datetime,
            datetime
        ]);
    var $geopend = false;
    if (results[0].existing == 0) {
        $geopend = false;
    }
    if (results[0].existing == 1 || results[0].existing > 1) {
        $geopend = true;
    }
    res.json({geopend: $geopend});
    });


router.get('/open/:entity_id', async function (req, res) {
    //req.params.entity_id
    //req.params.channel_id
    //optionele url parameter: timestamp (toon status on timestamp).

    //req.params.entity_id
    //req.params.channel_id
    //optionele url parameter: timestamp (toon status on timestamp).

    var channels = await channel.loadChannels();
    var entities = await entity.loadEntities();

    var datetime = req.params.timestamp || Math.floor(Date.now() / 1000);
    var huidigeDag = helper.formatDateFromUnix(datetime);
    const [results,fields] = await dbPool.query('SELECT  channel_id, count(id) as existing FROM opening_hours ' +
        'WHERE entity_id = ? AND day = ?  AND start_time <= ?  AND end_time >= ? GROUP BY  channel_id',
        [
            req.params.entity_id,
            huidigeDag,
            datetime,
            datetime
        ]);

        var $outputArray = {};

        await helper.asyncForEach(results, async (item) => {
            if (typeof $outputArray[item.channel_id] == 'undefined') {
                var channelObject = await channel.loadChannel(item.channel_id);
                channelObject.geopend =  (item.existing > 0) ? true : false;
                $outputArray[item.channel_id] = channelObject;
            }
        });
        res.json({channels: $outputArray});
});

//voor intern gebruik _ overzichtpagina
router.get('/open', async function (req, res) {
    //req.params.entity_id
    //req.params.channel_id
    //optionele url parameter: timestamp (toon status on timestamp).
    //SELECT entity_id , channel_id, count(id) as existing  FROM opening_hours WHERE day = '2017-12-10'  AND start_time <= 1512915217 AND end_time >= 1512915217 GROUP BY entity_id, channel_id

    //req.params.entity_id
    //req.params.channel_id
    //optionele url parameter: timestamp (toon status on timestamp).
    var datetime = req.params.timestamp || Math.floor(Date.now() / 1000);
    var huidigeDag = helper.formatDateFromUnix(datetime);
    // console.log(datetime);
    // console.log(huidigeDag);
    // console.log(req.params.entity_id);
    // console.log(req.params.channel_id);
    var channels = await channel.loadChannels();
    var entities = await entity.loadEntities();

    const [results, fields] = await dbPool.query('SELECT entity_id , channel_id, count(id) as existing FROM opening_hours ' +
        'WHERE day = ?  AND start_time <= ?  AND end_time >= ? GROUP BY entity_id, channel_id',
        [
            huidigeDag,
            datetime,
            datetime
        ]);
        var $outputArray = {};

        await helper.asyncForeach(results, async (item) => {
            if (typeof $outputArray[item.entity_id] == 'undefined') {

                var entityObject =  await entity.loadEntity(item.entity_id);
                entityObject.channels = {};
                $outputArray[item.entity_id] = entityObject;
            }
            if (typeof $outputArray[item.entity_id].channels[item.channel_id] == 'undefined') {
                var channelObject = await channel.loadChannel(item.channel_id);
                channelObject.geopend = (item.existing > 0) ? true : false;
                $outputArray[item.entity_id].channels[item.channel_id] = channelObject;
                console.log('prepopulating object array');
            }
    });

    res.json({entities: $outputArray});
});

//voor intern gebruik _ overzichtpagina
router.get('/entities', async function (req, res) {
    try {
    var entities = await entity.loadEntities();
    res.json({entities: entities});
    } catch (err) {
        console.error(err)
    }
}
)
;

router.get('/entities/:entity_id', async function (req, res) {
    try {
        var $entity = await entity.loadEntity(req.params.entity_id);
        console.log($entity);
        res.json({entity: $entity});
    } catch (err) {
        console.error(err)
    }
});

//voor intern gebruik _ overzichtpagina
router.get('/channels', async function (req, res) {
    try {
        var channels = await channel.loadChannels();
        res.json({channels: channels});
    } catch (err) {
        console.error(err)
    }
}
)
;

router.get('/', function (req, res) {
    res.json({
        message: 'OPENINGSUREN!',
        routes: router.stack
    });
});

// Export the router
module.exports = router;