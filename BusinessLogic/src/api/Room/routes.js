const roomCtrl = require('./controllers/RoomController');
const express = require('express');
const router = express.Router();
const { publicAccessPolicyKey, privateAccessPolicyKey } = require('../../config/config');
const canAccessRouter = require('../../middleware/canAccessRouter');

const hasPublicApiKey = canAccessRouter(publicAccessPolicyKey);

router.post('/', hasPublicApiKey, roomCtrl.createRoom);

module.exports = router;
