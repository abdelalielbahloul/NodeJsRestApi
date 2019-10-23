const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const orderController = require('../controllers/ordersController');

router.get('/', checkAuth, orderController.index);

router.post("/", checkAuth, orderController.create);

router.get('/:orderId', checkAuth, orderController.show);

router.delete('/:orderId', checkAuth, orderController.delete);



module.exports = router;