const mongoose = require('mongoose');

mongoose.Promise = global.Promise;  //config mongoose to use the Promises in node and not other 3rd party promises

mongoose.connect('mongodb://localhost:27017/TodoApp');

var Todo = mongoose.model('Todo', {                 //defining the model with attributes 'i.e., Collection Todo with Document and its fields
    text: {
        type: String       //setting the type
    },

    completed: {
        type: Boolean
    },
    completedAt: {
        type: Number
    }

});

//creating a new instance for Todo i.e., document


var newTodo = new Todo({
    text: 'Cook Dinner'
});

newTodo.save()  //saves the document to Mongo DB
    .then(

        (doc) => {      //contains the data saved with _id (JSON) and version "__v"

            console.log('Save success ', doc);
        }, (err) => {

            console.log('Error ', err);
        }

    );

var otherTodo = new Todo({
    text: 'Create API',
    completed: false,
    completedAt: 123
});

otherTodo.save()  //saves the document to Mongo DB
    .then(

        (doc) => {      //contains the data saved with _id (JSON) and version "__v"

            console.log('Save success ', JSON.stringify(doc,undefined,2));
        }, (err) => {

            console.log('Error ', err);
        }

    );

