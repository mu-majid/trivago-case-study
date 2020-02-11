const travellerCtrl = require('./controllers/TravellerController');
const express = require('express');
const router = express.Router();
const { privateAccessPolicyKey } = require('../../config/config');
const canAccessRouter = require('../../middleware/canAccessRouter');

const hasPrivateApiKey = canAccessRouter(privateAccessPolicyKey);

router.get('/', travellerCtrl.getTraveller);
router.post('/', travellerCtrl.createTraveller);
router.put('/:travellerKey/points', travellerCtrl.updateTravellerPoints);

module.exports = router;
