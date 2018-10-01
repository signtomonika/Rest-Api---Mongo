var express = require('express');
var bodyParser = require('body-parser');  //sends JSON to browser
const { ObjectID } = require('mongodb');

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

app.get('/todos', (req, res) => {

    Todo.find().then(
        (todos) => {
            res.send({ todos });
        }, (err) => {
            res.status(400).send(err);
        }
    )

});


app.get('/todos/:id', (req, res) => {

    var id = req.params.id;

    if (!ObjectID.isValid(id)) {

        res.status(400).send({ "err": "Invalid ID format" });

    } else {

        Todo.findById(id).then(
            (todo) => {
                if (todo) {
                    res.send({todo});  //sending as JSON and not an array
                } else {
                    res.status(404).send({ "err": "No todo found" });
                }
            }
        ).catch(
            (err) => {
                res.status(400).send();
            }
        )
    }

});

app.listen(3000, () => {
    console.log('Server started on port 3000..');
});


