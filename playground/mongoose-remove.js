const { ObjectID } = require('mongodb');

const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/todo');
const { User } = require('../server/models/user');


//Remove everything

Todo.remove({}).then((result) => {
    console.log(result);  //returns "n" - no of records deleted and "OK" status
});

//find one and remove

Todo.findOneAndRemove({ _id: '5bb2a449585e7c13fa80711c' })   //returns the document removed
    .then((todo) => {
        console.log(todo);
    });

//find by ID and remove

Todo.findByIdAndRemove('5bb2a449585e7c13fa80711c').then((todo) => {
    console.log(todo);
});

