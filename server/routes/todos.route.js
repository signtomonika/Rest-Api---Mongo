const { ObjectID } = require('mongodb');
const _ = require('lodash');

var { mongoose } = require('../db/mongoose');
var { Todo } = require('../models/todo');


module.exports = (app)=>{

    /***************/
    //Post New Todo
    /***************/

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
    
    /***************/
    //Get all todos
    /***************/

    app.get('/todos', (req, res) => {
    
        Todo.find().then(
            (todos) => {
                res.send({ todos });
            }, (err) => {
                res.status(400).send(err);
            }
        )
    
    });
    
    /***************/
    //Get todo by ID
    /***************/

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

    /***************/
    //Delete todo by ID
    /***************/
    
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

    /***************************/
    //Update or Patch todo by ID
    /***************************/
    
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
    

}