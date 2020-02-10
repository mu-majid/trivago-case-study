const monitorCtrl = require('./controllers/MonitoringController');
const express = require('express');
const router = express.Router();

router.post('/', monitorCtrl.audit);

module.exports = router;
