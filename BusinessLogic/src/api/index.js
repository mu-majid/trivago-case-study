const express = require('express');
const apiController = express.Router();

const travellerRouter = require('./Traveller/routes');
const bookingCtrl = require('./Booking/routes');
const roomCtrl = require('./Room/routes');

apiController.use('/travellers', travellerRouter);
apiController.use('/bookings', bookingCtrl);
apiController.use('/rooms', roomCtrl);

module.exports = apiController;