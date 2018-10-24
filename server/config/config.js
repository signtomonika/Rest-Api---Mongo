var env = process.env.NODE_ENV || 'development';


//In heroku, the env is set to Production

if (env === 'development' || env === 'test') {

    var config = require('./config.json');
    var envConfig = config[env]; //pulls respective property of environment

   Object.keys(envConfig).forEach(   // pulls property name i.e., PORT and MONGODB_URI
   (key)=>{
       process.env[key] = envConfig[key]  //sets the env variable with property values
       
   } );




}
