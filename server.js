#!/usr/bin/env node

/**
 * Module dependencies.
 */
var debug = require('debug')('comp214-backend:server');
var http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const tableRoutes = require('./routes/connection');  // Import the routes

// Initialize the Express app
const app = express();

/**
 * Get port from environment and store in Express.
 */
var port = normalizePort(process.env.PORT || '3001');
app.set('port', port);  // Set port in the app

/**
 * Create HTTP server using the Express app.
 */
var server = http.createServer(app);  // **Corrected: use the Express app**

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);  // Use server.listen() instead of app.listen()
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

// Middleware to parse JSON data in the request body
app.use(bodyParser.json());

// Use the routes for API calls
app.use('/api', tableRoutes);

// Handle 404 errors (if the endpoint doesn't exist)
app.use((req, res) => {
  res.status(404).send('Not Found');
});

console.log('==== The app is running on http://localhost:' + port );
