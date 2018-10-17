const express = require('express');
const bodyParser = require('body-parser');  //sends JSON to browser
const { ObjectID } = require('mongodb');
const _ = require('lodash');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');

var app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json()); //using the return value of bodyParser.json() as middleware

app.get('/',(req,res)=>{

    res.send('Node API for CRUD operations on Mongoose DB!')

})

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
                    res.send({ todo });  //sending as JSON and not an array
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

app.delete('/todos/:id', (req, res) => {

    var id = req.params.id;

    if (!ObjectID.isValid(id)) {

        res.status(400).send({ "err": "Invalid ID format" });

    } else {

        Todo.findByIdAndRemove(id).then(
            (todo) => {
                if (todo) {
                    res.status(200).send({ todo });  //sending as JSON and not an array
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

app.patch('/todos/:id', (req, res) => {

    var id = req.params.id;

    //control user to update only text and completedAt field

    var body = _.pick(req.body, ['text', 'completed']) //pick(<Object>,[<array of properties to extract from the object>])

    if (!ObjectID.isValid(id)) {

        res.status(400).send({ "err": "Invalid ID format" });

    } else {

        //check if user selects to update CompletedAt field

        if (_.isBoolean(body.completed) && body.completed) {    //enable user to decide whether to update the completedAt field

            body.completedAt = new Date().getTime();

        } else {

            body.completed = false;
            body.completedAt = null;

        }

        //update by ID

        Todo.findByIdAndUpdate(id, { $set: body }, { new: true })   //set gets key value pairs that will be updated. body is defined above; new will return the updated object
            .then((todo) => {

                if (!todo) {
                    res.status(404).send();
                } else {

                    res.send({ todo });
                }

            }).catch((err) => {
                res.status(400).send();
            })

    }


});

app.listen(port, () => {
    console.log(`Server started at port ${port}..`);
});


module.exports = { app };