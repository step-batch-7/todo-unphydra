const express = require('express');
const router = express.Router();

const handlers = require('./handlers');

router.use(handlers.getUserDetails);

module.exports = router;
