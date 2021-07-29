const express = require('express');
const router = express.Router();
const OauthController = require('../controllers/oauth');

router.post('/google', OauthController.google);
router.post('/facebook', OauthController.facebook);

module.exports = router;