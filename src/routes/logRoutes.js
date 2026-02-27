const router = require('express').Router();
const c = require('../controllers/logController');

router.get('/backup', c.backup);
router.get('/recovery', c.recovery);

module.exports = router;
