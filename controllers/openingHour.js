// Load modules
const dbPool = require('./db');
var util = require('util');
require('datejs');



async function createOpeningsUur(entity_id,channel_id,day,start_time,end_time, created_by){
    const [results, fields] = await dbPool.query('INSERT into opening_hours (`entity_id`, `channel_id`, `day`, `start_time`, `end_time`, `created`, `created_by`) VALUES (?,?,?,?,?,?,?)', [
        entity_id,channel_id,day,start_time,end_time, Math.floor(new Date().getTime()/1000),created_by
        ]);
    return results.insertId;
}

async function deleteOpeningHour(id) {
    ;
    const [rows, fields]  = await dbPool.query('DELETE FROM opening_hours where id = ?', [parseInt(id)]);
    return rows.affectedRows;
}

async function getOpeningHoursInRange(entity_id, channel_id, from,to) {
    console.log(parseInt(entity_id), parseInt(channel_id), parseInt(from), parseInt(to));
    const [rows, fields] =  await dbPool.query('SELECT * FROM opening_hours WHERE entity_id = ? and channel_id = ? AND start_time < ? and end_time > ?  ORDER BY start_time ASC', [
        parseInt(entity_id), parseInt(channel_id), parseInt(to), parseInt(from)
    ]);
    var now = new Date();
    rows.forEach(function(item){
        item.start_time_object = new Date(item.start_time * 1000);
        item.end_time_object = new Date(item.end_time * 1000);
        item.active = false;
        item.activeClass = 'inactive';
        if(now.toString('yyyy-MM-dd') == item.start_time_object.toString('yyyy-MM-dd')) {
            var time = now.getTime();
            if(time>item.start_time_object.getTime() && time < item.end_time_object.getTime()){
                item.active = true;
                item.activeClass = 'active';
            }
        }
    });
    return rows;
}
async function getOpeningHoursOfDay(entity_id, channel_id, date) {
    const [rows, fields] =  await dbPool.query('SELECT * FROM opening_hours WHERE entity_id = ? and channel_id = ? AND day = ? ORDER BY start_time ASC', [
        parseInt(entity_id), parseInt(channel_id), date.toString('yyyy-MM-dd')
    ]);
    var now = new Date();
    rows.forEach(function(item){
        item.start_time_object = new Date(item.start_time * 1000);
        item.end_time_object = new Date(item.end_time * 1000);
        item.active = false;
        item.activeClass = 'inactive';
        if(now.toString('yyyy-MM-dd') == item.start_time_object.toString('yyyy-MM-dd')) {
            var time = now.getTime();
            if(time>item.start_time_object.getTime() && time < item.end_time_object.getTime()){
                item.active = true;
                item.activeClass = 'active';
            }
        }
    });
    return rows;
}


module.exports = {
    createOpeningsUur: createOpeningsUur,
    deleteOpeningHour: deleteOpeningHour,
    getOpeningHoursOfDay: getOpeningHoursOfDay,
    getOpeningHoursInRange: getOpeningHoursInRange
};