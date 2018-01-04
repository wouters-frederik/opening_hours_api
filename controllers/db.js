// Require modules
const mysql = require('mysql2/promise');

// DB connection
const connectionOpts = process.env.CLEARDB_DATABASE_URL || {
  host: 'localhost',
  database: 'openinghours',
  user: 'root',
  password: 'mysql',
  canRetry: true
};

var dbPool =  mysql.createPool(connectionOpts);

// Attempt to catch disconnects
dbPool.on('connection', function (connection) {
  console.log('Connection established');

  // Below never get called
  connection.on('error', function (err) {
    console.error(new Date(), 'MySQL error', err.code);
  });
  connection.on('close', function (err) {
    console.error(new Date(), 'MySQL close', err);
  });
});

// Export the connection
module.exports = dbPool;