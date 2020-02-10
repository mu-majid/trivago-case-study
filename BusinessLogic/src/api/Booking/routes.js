const bookingCtrl = require('./controllers/BookingController');
const express = require('express');
const router = express.Router();
const { publicAccessPolicyKey } = require('../../config/config');
const canAccessRouter = require('../../middleware/canAccessRouter');

const hasPublicApiKey = canAccessRouter(publicAccessPolicyKey);

router.post('/', hasPublicApiKey, bookingCtrl.makeReservation);
router.post('/:bookingKey/cancel', hasPublicApiKey, bookingCtrl.abortReservation);

module.exports = router;
