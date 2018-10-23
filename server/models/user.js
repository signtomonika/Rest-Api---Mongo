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
    var access = 'auth';
    var token = jwt.sign({ _id: user._id.toHexString(), access }, 'abc123').toString();
    
    //creating token
    user.tokens = user.tokens.concat([{ access, token }]); //tokens is empty[] by default -> value assigned in user model

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

//adding MODEL METHOD => executable on Schema Users

userSchema.statics.findByToken = function (token) {

    var User = this; //entire collection

    var decoded;

    try {

        decoded = jwt.verify(token, 'abc123');

       
    } catch (err) {

        // return new Promise((resolve, reject) => {

        //     reject(err); //findOne will not be triggered if error

        // });

        //same as above

        return Promise.reject(err);

    }


    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });


};

var User = mongoose.model('User', userSchema);


module.exports = {

    User

};