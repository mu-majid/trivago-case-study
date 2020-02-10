const servicesCtrl = require('./controllers/ServicesController');
const publicAuth = require('./middleware/PublicAuth');
const privateAuth = require('./middleware/PrivateAuth');


const express = require('express');
const router = express.Router();

router.post('/bookings', publicAuth, servicesCtrl.makeReservation);
router.post('/bookings/:bookingKey/cancel', publicAuth,  servicesCtrl.abortReservation);

router.post('/rooms', privateAuth, servicesCtrl.createRoom);

router.post('/travellers', servicesCtrl.createTraveller);
router.put('/travellers/:travellerKey/points', privateAuth, servicesCtrl.updateTravellerPoints);


module.exports = router;
