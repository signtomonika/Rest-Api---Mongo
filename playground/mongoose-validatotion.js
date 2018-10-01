const mongoose = require('mongoose');

mongoose.Promise = global.Promise;  //config mongoose to use the Promises in node and not other 3rd party promises

mongoose.connect('mongodb://localhost:27017/TodoApp');

var Todo = mongoose.model('Todo', {                 //defining the model with attributes 'i.e., Collection Todo with Document and its fields
    text: {
        type: String,      //setting the type
        required: true, // mandatory ; if no attribute provided , returns validatorError
        minlength: 1,
        trim: true   //removes leading and/or trailing space    
    },

    completed: {
        type: Boolean,
        default: false  //defaults when not provided as attribute
    },
    completedAt: {
        type: Number,
        default: null
    }

});

//creating a new instance for Todo i.e., document

var newTodo = new Todo({
    text: 'Checking Validation'
});

newTodo.save()  //saves the document to Mongo DB
    .then(

        (doc) => {      //contains the data saved with _id (JSON) and version "__v"

            console.log('Save success ', doc);
        }, (err) => {

            console.log('Error ', err);
        }

    );

/* Result

Save success  { completed: false,
completedAt: null,
_id: 5bb26f8a728b3032ecb99213,
text: 'Checking Validation',
__v: 0 }

*/

var otherTodo = new Todo({});

/* results in Error 

 ValidationError: Todo validation failed: text: Path `text` is required.

*/

otherTodo.save()  //saves the document to Mongo DB
    .then(

        (doc) => {      //contains the data saved with _id (JSON) and version "__v"

            console.log('Save success ', JSON.stringify(doc, undefined, 2));
        }, (err) => {

            console.log('Error ', err);
        }

    );

/******* Challenge ****** */

var User = mongoose.model('User',
    {

        email: {
            type: String,
            required: true,
            trim: true,
            minlength: 1
        }
    }
)

var newUser = new User({ email: 'mno@example.com' });

newUser.save()
    .then(
        (doc) => {

            console.log('User Saved', JSON.stringify(doc, undefined, 2));
        },
        (err) => {
            console.log('Unable to Save the User');
        }
    );
 
