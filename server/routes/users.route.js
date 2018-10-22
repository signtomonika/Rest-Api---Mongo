const { ObjectID } = require('mongodb');
const _ = require('lodash');

var { mongoose } = require('../db/mongoose');
var { User } = require('../models/user');


module.exports = (app) => {

    /***************/
    //Insert New User
    /***************/

    app.post('/users', (req, res) => {

        var body = _.pick(req.body, ['email', 'password']);

        var user = new User(body);

        user.save().then(    //saving the model to DB
            (doc) => {
                res.send(doc);   //send the response to the browser
            }, (err) => {
                res.status(400).send(err);
            }
        );

    });

}