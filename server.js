// Require modules
const express = require('express');
const mysql = require('mysql2/promise');
const port = process.env.PORT || 8080;
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
const auth = require('./controllers/auth');
require('datejs');

var exphbs = require('express-handlebars');

// Initialize DB connection
const dbPool = require('./controllers/db');
// Require controllers
const channel = require('./controllers/channel');

const entity = require('./controllers/entity');



// Setup Express app
var app = express();
app.use(bodyParser.urlencoded({extended: true})); // configure app to use bodyParser(), this will let us get the data from a POST
app.use(bodyParser.json());
app.use(cookieParser());
app.set('json spaces', 40);
app.use(express.static(path.join(__dirname, 'public')));


// Setup template engine
app.engine('handlebars', exphbs(
    {
        defaultLayout: 'main',
        helpers: require('./controllers/handlebars.js').helpers
    }
));

app.set('view engine', 'handlebars');


channel.loadChannels();
entity.loadEntities();


//api routes.
var publicRouter = require('./middleware/routes/public');
app.use('/api/v1', publicRouter);


//frontpage and login and the works.

var storeOptions = {
    checkExpirationInterval: 900000,
    expiration: 86400000,
    createDatabaseTable: true,
    expires: 365 * 24 * 60 * 60 * 1000,
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
};

var sessionStore = new MySQLStore( {} , dbPool);

app.use(session({
    cookieName: 'session',
    key: 'openinghours_moehahahah',
    secret: 'keyboard cat',
    store: sessionStore
    // resave: false,
    // saveUninitialized: false
}));

var frontFacingRouter = require('./middleware/routes/frontfacing');
app.use('/', frontFacingRouter);

//The user interface for admins.
var protectedRouter = require('./middleware/routes/protected');
app.use('/ui', protectedRouter);


// Setup public directory
app.use(express.static('public'));


app.disable('x-powered-by');
// Start server
app.listen(port);

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
// application specific logging, throwing an error, or other logic here
});

console.log('What happens on port ' + port + ' stays on port ' + port );