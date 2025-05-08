const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');

router.post('/register', playerController.registerPlayer);
router.get('/balance/:username', playerController.getBalance);
router.post('/deposit', playerController.deposit);

module.exports = router;
