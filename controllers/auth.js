


exports.login = function(req, res, next) {
    // if (typeof req.session != 'undefined' && req.session.user != 'undefined') {
    //     console.log('redirecting');
    //     return res.redirect('/ui')
    // }
    //sess.email=req.body.email;
    var postUserName = req.body.userName;
    var postPass = req.body.userPass;
    var systemUser = (typeof process.env.AMDIN_USERNAME != 'undefined')? process.env.AMDIN_USERNAME : 'admin';
    var systemPass = (typeof process.env.AMDIN_USERPASS != 'undefined')? process.env.AMDIN_USERPASS : 'admin';
    if (postUserName == systemUser && postPass  == systemPass){
        req.session.user = {id: 1, name: systemUser};
        res.redirect('/ui');
    }
    else {
        res.redirect('/login?creds');
    }

    // User.authenticate(email, pass, function(err, user) {
    //     if (err) return next(err)
    //
    //     if (user) {
    //         req.session.user = {id: user.id, name: user.name}
    //         res.redirect('/ui')
    //     } else {
    //         res.redirect('/login')
    //     }
    // })
    return false;
};


exports.logout = function(req, res, next) {
    delete req.session.user;
    req.session.destroy(function(){
        res.redirect('/');
    });
};


// Authorize a given page only to registered users
exports.authorize = function(req, res, next) {
    if (typeof req.session == 'undefined' || typeof req.session.user == 'undefined') {
        res.redirect('/login');
    } else {
        return next();
    }
};

