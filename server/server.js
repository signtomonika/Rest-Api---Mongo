var express = require('express');
var bodyParser = require('body-parser');  //sends JSON to browser

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');

var app = express();

app.use(bodyParser.json()); //using the return value of bodyParser.json() as middleware

app.post('/todos', (req, res) => {

    var todo = new Todo({
        text: req.body.text   //passing the req body to the model
    });

    todo.save().then(    //saving the modek to DB
        (doc) => {
            res.send(doc);   //send the response to the browser
        }, (err) => {
            res.status(400).send(err);
        }
    );

});

app.listen(3000, () => {
    console.log('Server started on port 3000..');
})


