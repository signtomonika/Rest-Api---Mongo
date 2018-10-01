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

    /* *********** Find and Update *********** */

    db.collection('Todos').findOneAndUpdate(       //filter , actual update
        { text: 'Lunch' },
        {
            $set:
                { completed: true }
        },
        {
            returnOriginal: false   //"value" is after update ; if true or default => original record value before update
        }
    )
        .then(

            (result) => {   //contains no of records updated "n", "updatedExisting" => boolean, record after update "value", status "OK"

                console.log('Update Success ', result);
            }

        );

    /* *********** Find, Update and Increment*********** */

    db.collection('Users').findOneAndUpdate(

        {
            _id: new ObjectID('5bb25416a45a6f1de0cd3406')
        },
        {
            $set: { name: 'BG' },
            $inc: { age: 1 }  //incrmenting age by 1
        },
        {
            returnOriginal: false
        }

    ).then(
        (result) => {
            console.log('Update and Increment Success ', result);
        }
    );

    client.close();

});
