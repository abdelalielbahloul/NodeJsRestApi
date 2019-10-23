const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');
const checkAuth = require('../middleware/check-auth');



router.post('/signup', userController.register);

router.post('/signin', userController.login)

router.delete('/:userId', checkAuth, userController.delete)



module.exports = router;