const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');


router.post('/signup', userController.register);

router.post('/signin', userController.login)

router.delete('/:userId', userController.delete)



module.exports = router;