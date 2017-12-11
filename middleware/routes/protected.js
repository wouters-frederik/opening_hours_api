// Require modules
const express = require('express');

// Setup router for protected routes
var protectedRouter = express.Router();

// HTML endpoints
protectedRouter.get('/', function (req, res) {
  res.render('entry');
});
protectedRouter.get('/channels', function (req, res) {
  res.render('channels');
});
protectedRouter.get('/organisations', function (req, res) {
  res.render('organisations');
});
protectedRouter.get('/login', function (req, res) {
  res.render('login');
});

// Export the router
module.exports = protectedRouter;