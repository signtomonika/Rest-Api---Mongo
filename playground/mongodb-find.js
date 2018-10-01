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

    db.collection('Todos').find().toArray()           //find() returns cursor; toArray() returns promise
        .then(
            (docs) => {

                console.log('To Dos');
                console.log(JSON.stringify(docs, undefined, 2));

            }, (err) => {

                console.log('Unable to fetch the documents');
            }
        );

    /****** Fetch by condition ********* */

    db.collection('Todos').find({ completed: false }).toArray()
        .then(
            (docs) => {

                console.log('To Dos that are yet to be completed');
                console.log(JSON.stringify(docs, undefined, 2));

            }, (err) => {

                console.log('Unable to fetch the documents');
            }
        );


    db.collection('Todos').find(
        { _id: new ObjectID('5bb256a3585e7c13fa806566') }   //becoz, _id is of type object
    ).toArray()
        .then(
            (docs) => {

                console.log('To Dos By Object ID : ', '5bb256a3585e7c13fa806566');
                console.log(JSON.stringify(docs, undefined, 2));

            }, (err) => {

                console.log('Unable to fetch the documents');
            }
        );


    /******* Count ****** */

    db.collection('Todos').count()  //returns no of docs in the collection
        .then(
            (count) => {

                console.log(`To Dos count : ${count} `);


            }, (err) => {

                console.log('Unable to count the documents');
            }
        );

    db.collection('Users').find({ name: 'Tubby' }).count()  //count by condition
        .then(

            (count) => {

                console.log(`No of Docs with Name "Tubby" : ${count}`);
            },
            (err) => {

                console.log('Error in counting');
            }

        );

    client.close();

});
