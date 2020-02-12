
const express = require('express');
const router = express.Router();

const servicesCtrl = require('./controllers/ServicesController');
const publicAuth = require('./middleware/PublicAuth');
const privateAuth = require('./middleware/PrivateAuth');
const RequestValidator = require('./middleware/RequestValidator');
const { 
  makeReservationSchema,
  cancelReservationSchema,
  createTravellerSchema,
  createRoomSchema,
  updateTravellerPointsSchema,
  getTravelerBookingsSchema,
  getTravellerSchema,
  getRoomsSchema
} = require('./schema/schemas');

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

router.get('/bookings', [
  RequestValidator(getTravelerBookingsSchema),
  publicAuth,
  servicesCtrl.getTravelerBookings
]);

router.post('/rooms', [
  RequestValidator(createRoomSchema), 
  privateAuth, 
  servicesCtrl.createRoom
]);

router.get('/rooms', [
  RequestValidator(getRoomsSchema),
  privateAuth,
  servicesCtrl.getRooms
]);

router.post('/travellers', [
  RequestValidator(createTravellerSchema),
  servicesCtrl.createTraveller
]);

router.get('/travellers/:travellerKey', [
  RequestValidator(getTravellerSchema),
  publicAuth,
  servicesCtrl.getTraveller
]);

router.put('/travellers/:travellerKey/points',[
  RequestValidator(updateTravellerPointsSchema), 
  privateAuth, 
  servicesCtrl.updateTravellerPoints
]);


module.exports = router;
