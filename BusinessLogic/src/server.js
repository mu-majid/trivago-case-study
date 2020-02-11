const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const { server, database } = require('./config/config');
const apiController = require('./api/index');
const authenticateService = require('./middleware/authenticateService');

const connectToDb = require('./seed');

(async () => {
  const connectionString = `mongodb://${database.host}:${database.port}/${(process.env.NODE_ENV === 'testing') ? database.dbNameTesting : database.dbName }`;
    
  const options = { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };

  await connectToDb(connectionString, options);

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  
  app.use('/api', authenticateService, apiController);
  
  app.listen(server.port, () => {
    console.log(`Server started at ${server.port} ...`);
  });
})();


