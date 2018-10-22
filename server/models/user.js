const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var userSchema = new mongoose.Schema({ //schema allows defining a model structure
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {

            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },

    password: {

        type: String,
        require: true,
        minlength: 6

    },

    tokens: [{
        access: {

            type: String,
            require: true

        },
        token: {

            type: String,
            require: true

        }
    }]
});

//adding INSTANCE METHODS => executable on each document in a collection

//defining traditional function and not arrow functions ; arrow functions doesn't bind with "this" keyword -> stores current doc

userSchema.methods.generateAuthToken = function () {

    var user = this; //access to individual document
    //need access value and token value to create user.tokens property
    var accessVal = 'auth';
    var token = jwt.sign({ _id: user._id.toHexString(), access: accessVal }, 'abc123').toString();
    //creating token
    user.tokens = user.tokens.concat([{ accessVal, token }]); //tokens is empty[] by default -> value assigned in user model

   return user.save().then( //saving user model to server

        () => { return token; }

    );
};

//Overriding method to retrieve only selected values

userSchema.methods.toJSON = function () { //defines what is sent back when mongoose model is converted to json

    var user = this;

    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);

};

var User = mongoose.model('User', userSchema);


module.exports = {

    User

};