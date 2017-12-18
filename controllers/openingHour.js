// Load modules
const dbPool = require('./db');
var util = require('util');
require('datejs');



function createOpeningsUur(entity_id,channel_id,day,start_time,end_time, created_by, callback){
    dbPool.query('INSERT into opening_hours (`entity_id`, `channel_id`, `day`, `start_time`, `end_time`, `created`, `created_by`) VALUES (?,?,?,?,?,?,?)', [
        entity_id,channel_id,day,start_time,end_time,Math.floor(new Date().getTime()/1000),created_by
        ],
        function (error, results, fields) {
            if (!error) {
                callback(error, results.insertId);
            } else {
                //console.log('error', error);
            }

            // error will be an Error if one occurred during the query
            // results will contain the results of the query
            // fields will contain information about the returned results fields (if any)
        });
}

function deleteOpeningHour(id, callback) {
    dbPool.query('DELETE FROM opening_hours where id = ?', [id],
        function (error, results, fields) {
            if (!error) {
                callback(error);
            } else {
                //console.log('error', error);
            }

            // error will be an Error if one occurred during the query
            // results will contain the results of the query
            // fields will contain information about the returned results fields (if any)
        });
}

function getOpeningHoursInRange(entity_id, channel_id, from,to, callback) {
    var deferred = Q.defer();
    dbPool.query('SELECT * FROM opening_hours WHERE entity_id = ? and channel_id = ? AND start_time < ? and end_time > ?  ORDER BY start_time ASC', [entity_id, channel_id, to, from],
        function (error, results, fields) {
            if (!error) {
                deferred.resolve(results);
            } else {
                //console.log('error', error);
            }
            // error will be an Error if one occurred during the query
            // results will contain the results of the query
            // fields will contain information about the returned results fields (if any)
        });
    return deferred.promise;
}
function getOpeningHoursOfDay(entity_id, channel_id, date, callback) {

    var end_of_day = Date.today()
        .set({ hour: 23, minute: 59 });
    end_of_day = Math.floor(end_of_day.getTime() /1000);
    var start_of_day = Date.today()
        .set({ hour: 0, minute: 1 });
    start_of_day = Math.floor(start_of_day.getTime() /1000);
    getOpeningHoursInRange(entity_id,channel_id,start_of_day,end_of_day,function(error,results){

    });
}


module.exports = {
    createOpeningsUur: createOpeningsUur,
    deleteOpeningHour: deleteOpeningHour,
    getOpeningHoursOfDay: getOpeningHoursOfDay
};