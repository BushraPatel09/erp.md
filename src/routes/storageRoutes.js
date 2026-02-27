const router = require('express').Router();
const c = require('../controllers/storageController');

router.get('/status', c.status);
router.get('/usage', c.usage);

module.exports = router;
