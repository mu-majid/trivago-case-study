const express = require('express');
const apiController = express.Router();

const auditRouter = require('./Monitoring/routes');

apiController.use('/audit', auditRouter);

module.exports = apiController;