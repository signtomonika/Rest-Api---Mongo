var mongoose = require('mongoose');

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

module.exports = {

    Todo

};