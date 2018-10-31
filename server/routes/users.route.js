const { ObjectID } = require('mongodb');
const _ = require('lodash');

var { mongoose } = require('../db/mongoose');
var { User } = require('../models/user');

var { authenticate } = require('../middleware/authenticate');


module.exports = (app) => {

    /***************/
    //Insert New User
    /***************/

    app.post('/users', async (req, res) => {

        try {

            const body = _.pick(req.body, ['email', 'password']);

            const user = new User(body);

            await user.save();

            const token = await user.generateAuthToken();

            //send the token back as http response header -> final goal
            //header takes 2 arguments -> key value pair -> <header name>, <value of header>
            //prefixing header with "x-" indicates the use of custom header - something other than default http response header
            //customized bcoz, we are using jwt schemed token

            res.header('x-auth', token).send(user);


        } catch (err) {
            res.status(400).send(err);
        }

    });

    /**************************/
    //get all Users - For checking 
    /**************************/

    app.get('/users', (req, res) => {

        User.find().then(
            (users) => {

                res.send({ users });
            }, (err) => {

                res.status(400).send(err);
            }
        )
    });


    /**************************/
    //get a User - PRIVATE ROUTE
    /**************************/

    app.get('/users/me', authenticate, (req, res) => {  //executes authenticate method

        res.send(req.user);

    });


    /**************************/
    //User Login 
    /**************************/

    app.post('/users/login', async (req, res) => {

        try {

            const body = _.pick(req.body, ['email', 'password']);

            const user = await User.findByCredentials(body.email, body.password);

            const token = await user.generateAuthToken();

            res.header('x-auth', token).send(user); //saving refreshed token

        } catch (err) {
            res.status(400).send();
        }


    });


    /**************************/
    //User Logout 
    /**************************/

    app.delete('/users/me/token', authenticate, async (req, res) => {   //authenticate gets token and returns user and its token 


        try {
            await req.user.removeToken(req.token);
            res.status(200).send();

        } catch (err) {
            res.status(400).send();
        }


    });

}