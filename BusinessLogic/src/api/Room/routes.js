const roomCtrl = require('./controllers/RoomController');
const express = require('express');
const router = express.Router();

router.post('/', roomCtrl.createRoom);

router.get('/', roomCtrl.getRooms);


module.exports = router;
