//const MongoClient = require('mongodb').MongoClient;

const { MongoClient, ObjectID } = require('mongodb'); //identical to above and imports another object "ObjectID" => object destructuring

var obj = new ObjectID(); //new instance of ObjectID from mongodb package above

console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {

    if (err) {

        return console.log('Unable to connect to Mongo Database Server');

    } else {

        console.log('Connected to Mongo DB');
    }

    const db = client.db('TodoApp');

    /***** Delete Many ***** */

    db.collection('Todos').deleteMany({ text: 'Lunch' })
        .then(

            (result) => {

                console.log('Success : ', result);  //contains the no of records deleted "n" and status "OK" => n could be any number
            }

        );

    /***** Delete One ***** */

    db.collection('Todos').deleteOne({ text: 'Lunch' })
    .then(

        (result) => {

            console.log('Success : ', result);  //contains the no of records deleted "n" and status "OK" => n is always 1
        }

    );
    
    /***** Find One and Delete ***** */

    db.collection('Todos').findOneAndDelete({ completed: false })
    .then(

        (result) => {

            console.log('Success : ', result); //contains the no of records deleted "n", status "OK" and the document that was deleted as "value"
        }

    );

      client.close();

});
