const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');


/************/
//Schema
/************/

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

/***********************************************************/
//Generate AuthToken
/***********************************************************/

//adding INSTANCE METHODS => executable on each document in a collection

//defining traditional function and not arrow functions ; arrow functions doesn't bind with "this" keyword -> stores current doc

userSchema.methods.generateAuthToken = function () {

    var user = this; //access to individual document
    //need access value and token value to create user.tokens property
    var access = 'auth';
    var token = jwt.sign({ _id: user._id.toHexString(), access }, process.env.JWT_SEC).toString();

    //creating token
    user.tokens = user.tokens.concat([{ access, token }]); //tokens is empty[] by default -> value assigned in user model

    return user.save().then( //saving user model to server

        () => { return token; }

    );
};

/***********************************************************/
//Defining JSON output
/***********************************************************/

//Overriding method to retrieve only selected values

userSchema.methods.toJSON = function () { //defines what is sent back when mongoose model is converted to json

    var user = this;

    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);

};

/***********************************************************/
//Find User by AuthToken
/***********************************************************/

//adding MODEL METHOD => executable on Schema Users

userSchema.statics.findByToken = function (token) {

    var User = this; //entire collection

    var decoded;

    try {

        decoded = jwt.verify(token, process.env.JWT_SEC);


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

/***********************************************************/
//Find User by Credntials
/***********************************************************/

//adding MODEL METHOD => executable on Schema Users

userSchema.statics.findByCredentials = function (email, password) {

    var User = this;

    return User.findOne({ email }).then(
        (user) => {

            if (!user) {
                return Promise.reject();
            }

            return new Promise(
                (resolve, reject) => {

                    bcrypt.compare(password, user.password, (err, result) => {

                        if (result) {

                            resolve(user);
                        } else {

                            reject();
                        }

                    });

                });

        });


};

/***********************************************************/
//Delete User by Token
/***********************************************************/

userSchema.methods.removeToken = function (tokenArg){

    var user = this;

    return user.update({

        $pull:{   //pull removes Tokens object (array) with matching criteria from the collection
            tokens: {
                token : tokenArg
            }
        }

    });

};

/***********************************************************/
//Save Hashed Password instead of plain text password
/***********************************************************/

//Middleware to run before save -> ensure hashed password is saved in DB

userSchema.pre('save', function (next) {

    var user = this;

    if (user.isModified('password')) {  //isModified returns true if password is modified

        bcrypt.genSalt(10, (err, salt) => {

            bcrypt.hash(user.password, salt, (err, hash) => {

                user.password = hash;  //hashed password gets saved instead of plain text
                next();

            });

        });


    } else {

        next();
    }

});

/***********************************************************/
//Exporting User Model
/***********************************************************/

var User = mongoose.model('User', userSchema);


module.exports = {

    User

};