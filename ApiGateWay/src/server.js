const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const { server, database } = require('./config/config');
const apiController = require('./api/index');
const gateWayAuth = require('./middleware/gatewayAuth');

(async () => {

  await mongoose.connect(
    `mongodb://${database.host}:${database.port}/${database.dbName}`,
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
  );

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  
  app.use('/api', gateWayAuth, apiController);
  
  app.listen(server.port, () => {
    console.log(`Server started at ${server.port} ...`);
  });
})();