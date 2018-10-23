var { User } = require('../models/user');

//middleware function

var authenticate = (req, res, next) => {

    var token = req.header('x-auth'); //getting the token from header


    User.findByToken(token).then((user) => {
        if (!user) {

            return Promise.reject(); //will be handled by the catch block below.

        }

        req.user = user;
        req.token = token;
        next(); //needed for the get request to execute

    }).catch((err) => {

        res.status(401).send(err);

    });

};

module.exports = { authenticate };