const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');


var id = '5bb26b90aad1d92a842a5814';

if(!ObjectID.isValid(id)) {

    console.log('ID is not valid');
}

Todo.find({
    _id: id  //mongoose can automatically parse string into object
}).then(
    (todos) => {
        console.log('Todos ', todos);  //returns an array
    }
);

Todo.findOne({
    _id: id
}).then(
    (todo) => {
        console.log('Todo ', todo);  //returns 1 JSON object
    }
);

Todo.findById(id).then((todo) => {
    if (!todo) {
        console.log('ID not found');
    }
    console.log('Todo By ID ', todo);  //returns 1 JSON object
}
).catch(
    (err)=>{
        console.log(err);
    }
);

/************* USER **************** */

var userID = '5bb271895178143650a1c587'

var userAbsent = '5bb271895178143650a1c588'

var userError = '5bb271895178143650a1c5876789'

User.findById(userID).then(
    (user) => {
        if (user) {
            console.log('User Found : ', JSON.stringify(user, undefined, 2));
        } else {
            console.log('User not Found!');
        }
    }
).catch(
    (err) => {

        console.log('Error ', err);
    }
);