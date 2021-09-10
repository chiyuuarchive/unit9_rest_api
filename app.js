// Load modules
const express = require('express');
const morgan = require('morgan');

// Set up routing
const routes = require("./routes/index");

// Create the Express app
const app = express();

// Import the model instances of sequelize
const models = require("./models");
const { sequelize } = require("./models");

// Variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// Setup morgan which gives us http request logging
app.use(morgan('dev'));

// Setup request body JSON parsing
app.use(express.json());

// Add API routes.
app.use("/api", routes);


// Use an IIFE function 
(async() => {
  // Sync the model with the database
  await models.sequelize.sync();
  try {
    // Attempt to connect to the database
    await sequelize.authenticate();
    console.log("Connected to the database successfully!")
  }
  catch {
    console.log("There seems to be a connection error...")
  }
})()

/* GET Root route */
app.get('/', (req, res) => {
  res.json({
      message: 'Welcome to the REST API project!',
  });
});

// Send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// Setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }
  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// Set up a port with nr. 5000
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
