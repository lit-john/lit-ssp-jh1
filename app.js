
/**
 *  This app demonstrates how to connect up to and read, write and delete data from a MySql
 *  database.
 */


var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

/**
 * We need to require the mysql module. Remember that this is going to have to be
 * installed. I have added it to the dependencies section of the package.json file
 * so if you 'cd' into the directory for this app and type "npm install" then node
 * will install all the dependencies listed in package.json.
 *
 * The other way to do it is simply type "npm install mysql"
 */

var mysql = require('mysql');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.logger('dev'));

// Just in case I need to use sessions I have included the folowing lines
app.use(express.cookieParser('clonmellit'));
app.use(express.session());

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// A variable to hold the connection to the database
var connection;

/**
 *  Here I declare a function (not calling it yet, just declaring it) that contains
 *  the code to connect to the database. The reason the code is it's own function
 *  is incase there is a problem connecting to the DB the function can call itself
 *  to try again. This will be more apparent when you look at the code. Note: I have
 *  taken this code from the github page for the mysql module
 *    https://github.com/felixge/node-mysql
 *
 */
function connectToDB() {
  // Create a connection by calling createConnection and pass it a JSON object with
  // all the neccessary information.
  connection = mysql.createConnection({
    host : 's6vjs2alrv.database.windows.net:1433',
    user : 'nodejs@s6vjs2alrv',
    password : 'Passw0rd',
    database : 'nodejs'
  });

  // connect to the DB, the calling back function gets called once the connection
  // has been made (or not)
  connection.connect(function(err) {
    if (err) {
      console.log('Error connecting to DB: ', err);
      // If we experienced a problem when connection to the DB then
      // back off fro 2000 ms and try again. To try again we call this function
      // again, hence the reason we have put all of this code it its own function
      setTimeout(connectToDB, 2000);
    }
  });

  // If we receive an error event handle it
  connection.on('error', function(err) {
    console.log('Got a DB Error: ', err);
    /**
     * If we have lost a connection to the DB, ,maybe we are restarting it, then
     * try and reconnect, otherwise throw an exception
     */
    if(err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

// Call the connectToDB function
connectToDB();

// Set an application variable called dbConnection and put it equal to our connection
// variable. Essentially what we are doing making our connection variable (which is only
// visible to code in this page) and application variable which means it can be accessed
// pretty much anywhere in our application. You will see examples of it being accessed in
// routes/index.js
app.set('dbConnection', connection);

/**
 *  Route the requests
 */
app.get('/', routes.index);
app.all('/addColor', routes.addColor);
app.get('/delete', routes.deleteColor);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
