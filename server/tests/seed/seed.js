const { Todo } = require('../../models/todo');
const { User } =require('../../models/user');
const { ObjectID } = require('mongodb');

const jwt = require('jsonwebtoken');

/***********************************************************/
//Dummy Data for Testing
/***********************************************************/

/********** TODOS ***************/

const todos = [
    {
        _id: new ObjectID(),
        text: 'test todo 1'
    },
    {
        _id: new ObjectID(),
        text: 'test todo 2',
        completed: true,
        completedAt: 333
    }
];


const populateTodos = (done)=>{

    Todo.remove({}).then(  //removing existing data before insert
        () => {
            return Todo.insertMany(todos);

        }
    ).then(() => done());


};

/********** USERS ***************/

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [

    {
        _id: userOneId,
        email: 'yang@panda.com',
        password: 'userOnePass',
        tokens:[{
                access: 'auth',
                token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
            } ]
    },
    {
        _id: userTwoId,
        email: 'lun@panda.com',
        password: 'userTwoPass'
    }

];

const populateUsers = (done)=>{

    User.remove({}).then(()=>{

        var userOne = new User(users[0]).save();  //calling save to ensure hashed pwd is saved
        var userTwo = new User(users[1]).save();

       return Promise.all([userOne,userTwo]);   //promise.all takes an array of promises and resolves after all the added promises are finished

    }).then(()=> done());

};


module.exports = {

    todos, users,
    populateTodos , populateUsers


};