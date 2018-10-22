const jwt = require('jsonwebtoken');

var data = {
    id: 10
};

var token = jwt.sign(data,'123abc');  //returns a token i.e., hash with secert ; arguments: key , salt (secret)

console.log(token);

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImlhdCI6MTU0MDIzNTI2Mn0.Nz0akgzqZKnzMzSKbDhpk20ZXiZKrkpphjiPXNWaAoo
/*Header info- Algorithm & token type*//* PayLoad Data->contains data.id *//*hash-> allows to verify the secret */

var decoded = jwt.verify(token,'123abc'); //verifies the token with the secret

console.log(`decoded : ${JSON.stringify(decoded)}`); 

// decoded: {
//     "id": 10,  //data.id
//         "iat": 1540235694  //timestamp
// } 

//below throws error : JsonWebTokenError: invalid signature
var decoded = jwt.verify(token+1,'123abc'); 
var decoded = jwt.verify(token,'123'); 