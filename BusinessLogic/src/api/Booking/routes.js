const bookingCtrl = require('./controllers/BookingController');
const express = require('express');
const router = express.Router();

router.post('/', bookingCtrl.makeReservation);
router.post('/:bookingKey/cancel',  bookingCtrl.abortReservation);

module.exports = router;
