//const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb'); //identical to above and imports another object "ObjectID" => object destructuring

/* to modify the mongodb created random object id "_id" */

// var obj = new ObjectID(); //new instance of ObjectID from mongodb package above

// console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {

    if (err) {

        return console.log('Unable to connect to Mongo Database Server');

    } else {

        console.log('Connected to Mongo DB');
    }

    const db = client.db('TodoApp');

    /********************* INSERT DATA ************************************ */

    /** Adding a new Collection */

    db.collection('Todos').insertOne({

        text: 'Something to do',
        completed: false

    }, (err, result) => {

        if (err) {

            console.log('Data not inserted', err);
        } else {

            console.log('Data Insert Success', JSON.stringify(result.ops, undefined, 2));

        }

    });

    /*** Adding new User */

    db.collection('Users').insertOne({
        name: 'Brown',
        age: 20,
        location: 'Reno'
    }, (err, result) => {

        if (err) {

            console.log('Unable to Insert the User');
        } else {

            console.log('User added', JSON.stringify(result.ops, undefined, 2));
            console.log('ID Timestamp : ', JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
        }

    });


    client.close();

});
