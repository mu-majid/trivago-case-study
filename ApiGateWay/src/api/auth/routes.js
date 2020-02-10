
const express = require('express');
const router = express.Router();

const servicesCtrl = require('./controllers/ServicesController');
const publicAuth = require('./middleware/PublicAuth');
const privateAuth = require('./middleware/PrivateAuth');
const RequestValidator = require('./middleware/RequestValidator');
const { makeReservationSchema, cancelReservationSchema, createTravellerSchema } = require('./schema/schemas');

router.post('/bookings', [
  RequestValidator(makeReservationSchema), 
  publicAuth, 
  servicesCtrl.makeReservation
]);

router.post('/bookings/:bookingKey/cancel', [
  RequestValidator(cancelReservationSchema),
  publicAuth, 
  servicesCtrl.abortReservation
]);

router.post('/rooms', privateAuth, servicesCtrl.createRoom);

router.post('/travellers', [
  RequestValidator(createTravellerSchema),
  servicesCtrl.createTraveller
]);
router.put('/travellers/:travellerKey/points', privateAuth, servicesCtrl.updateTravellerPoints);


module.exports = router;
