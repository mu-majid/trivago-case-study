const express = require('express');
const apiController = express.Router();

const authRoutes = require('./auth/routes');

apiController.use('/', authRoutes);

module.exports = apiController;