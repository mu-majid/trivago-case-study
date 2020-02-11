const roomCtrl = require('./controllers/RoomController');
const express = require('express');
const router = express.Router();

router.post('/', roomCtrl.createRoom);

module.exports = router;
