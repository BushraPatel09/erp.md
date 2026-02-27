const router = require('express').Router();
const c = require('../controllers/backupController');

router.post('/create', c.create);
router.put('/update/:id', c.update);
router.delete('/delete/:id', c.remove);
router.post('/start/:id', c.start);
router.post('/stop/:id', c.stop);
router.get('/status', c.status);
router.get('/history', c.history);

module.exports = router;
