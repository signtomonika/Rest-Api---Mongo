const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123456';

bcrypt.genSalt(10, (err,salt)=>{  // <number of rounds> => bigger the number, longer the alogorithm ; best practice for passwords

    bcrypt.hash(password,salt,(err,hash)=>{ // salt => result of above algorithm ; password is combined with salt and then hashed

        console.log(hash);  //hash will be different for every run - hence, best to avoid hacking

    });

});

var hashedPassword = '$2a$10$Eg4slc.zshv0TPQX5ZU/keCbcjLNZNfMXkNHw.jE2WwyIrCX97/Ve'

bcrypt.compare(password,hashedPassword,(err, result)=>{

    console.log(result); //result is true if password and hash are same and vice versa

})