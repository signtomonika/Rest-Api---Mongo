require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');  //sends JSON to browser


// View 
const hbs = require('hbs');
var favicon = require('serve-favicon');
var path = require('path');

var app = express();

app.set('view engine', 'hbs');

const port = process.env.PORT || 3000;

app.use(bodyParser.json()); //using the return value of bodyParser.json() as middleware

app.use(express.static(path.join(__dirname, 'public')));

app.use(favicon(path.join(__dirname, '/public', 'favicon.ico')));


//Home

app.get('/',(req,res)=>{

    res.render('home.hbs');

});

//require routes

require('./routes/todos.route')(app);

require('./routes/users.route')(app);


//Port

app.listen(port, () => {
    console.log(`Server started at port ${port}..`);
});


module.exports = { app };