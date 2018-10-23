const { ObjectID } = require('mongodb');
const _ = require('lodash');

var { mongoose } = require('../db/mongoose');
var { User } = require('../models/user');

var { authenticate } = require('../middleware/authenticate');


module.exports = (app) => {

    /***************/
    //Insert New User
    /***************/

    app.post('/users', (req, res) => {

        var body = _.pick(req.body, ['email', 'password']);

        var user = new User(body);

        user.save().then(    //saving the model to DB //user.tokens will be an empty array ; it is updated after user saved in server
            () => {

                return user.generateAuthToken();  //returns token

            }
        ).then((token) => {

            //send the token back as http response header -> final goal
            //header takes 2 arguments -> key value pair -> <header name>, <value of header>
            //prefixing header with "x-" indicates the use of custom header - something other than default http response header
            //customized bcoz, we are using jwt schemed token

            res.header('x-auth', token).send(user);


        }

        ).catch((err) => {
            res.status(400).send(err);
        });

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

    app.post('/users/login', (req, res) => {

        var body = _.pick(req.body, ['email', 'password']);

        User.findByCredentials(body.email, body.password)
            .then((user) => {

                return user.generateAuthToken().then((token)=>{
                    res.header('x-auth', token).send(user);  //saving refreshed token
                });

            }).catch((err) => {

                res.status(400).send();

            });

    });

    
    /**************************/
    //User Logout 
    /**************************/

    app.delete('/users/me/token',authenticate, (req,res)=>{

        req.user.removeToken(req.token).then(()=>{  //authenticate gets token and returns user and its token 
            res.status(200).send()
        },()=>{
            res.status(400).send();
        })

    });


}