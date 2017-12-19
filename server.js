// Require modules
const express = require('express');
const port = process.env.PORT || 8080;
const path = require('path');
const bodyParser = require('body-parser');
require('datejs')

var exphbs = require('express-handlebars');


// Setup Express app
var app = express();
app.use(bodyParser.urlencoded({extended: true})); // configure app to use bodyParser(), this will let us get the data from a POST
app.use(bodyParser.json());
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

// Initialize DB connection
const dbPool = require('./controllers/db');
// Require controllers
const channel = require('./controllers/channel');
const entity = require('./controllers/entity');

console.log('Load channels and entities');
channel.loadChannels();
entity.loadEntities();
console.log('Loaded in memory.');

// Setup and register routes
var publicRouter = require('./middleware/routes/public');
var protectedRouter = require('./middleware/routes/protected');

var frontFacingRouter = express.Router();
frontFacingRouter.get('/', function (req, res) {
  res.render('frontpage');
});
app.use('/api/v1', publicRouter);
app.use('/ui', protectedRouter);
app.use('/', frontFacingRouter);

// Setup public directory
app.use(express.static('public'))

// Start server
app.listen(port);
console.log('What happens on port ' + port + ' stays on port ' + port );