const express = require('express');
const auth = require('./../../controllers/auth');
var frontFacingRouter = express.Router();

frontFacingRouter.get('/', function (req, res) {
    res.render('frontpage');
});

frontFacingRouter.get('/login', function (req, res) {
    res.render('login', {});
});

// Post requests from a form can log in a user.
frontFacingRouter.post('/login', auth.login);

// Get requests will log out the user.
frontFacingRouter.get('/logout', auth.logout);
// Export the router
module.exports = frontFacingRouter;