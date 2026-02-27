const router = require('express').Router();
const c = require('../controllers/recoveryController');

router.post('/start', c.start);
router.get('/status', c.status);
router.get('/history', c.history);

module.exports = router;
