const { SHA256 } = require('crypto-js');

var message = 'I am user number 3';

var hash = SHA256(message).toString();

console.log(`Message: ${message}`);
console.log(`Hash: ${hash}`);

var data = {
    id: 4
};

var token = {
    data,
    hash: SHA256(JSON.stringify(data) + 'somesecret').toString()  //salting the hash with some secret value to avoid user manipulating it
};

var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString(); //Actual correct hash with salting

token.data.id = 5;
token.hash = SHA256(JSON.stringify(token.data)).toString();  //no salting - the secret lives on server hence the user cannot manipulate

if (resultHash === token.hash) {
    console.log('Data was not changed');
} else {
    console.log('Data was changed. Do not trust!');
}