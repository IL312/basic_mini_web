const router = require('express').Router();

const clientRoutes = require('./clientRoutes');
const orderRoutes = require('./orderRoutes');

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

router.use('/clients', clientRoutes);
router.use('/orders', orderRoutes);

module.exports = router;