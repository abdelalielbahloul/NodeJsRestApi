const express = require('express');

const router = express.Router();

const Order = require('../models/order');

router.get('/', (req, res, next) => {

    res.status(200).json({
        message : 'orders is fitched'
    })
});

router.post('/', (req, res, next) => {

    const order = {
        id: req.body.orderId,
        quantite: req.body.quantite
    }
    res.status(201).json({
        message : 'orders is created',
        order: order
    })
});

router.get('/:orderId', (req, res, next) => {

    res.status(200).json({
        message : 'orders details',
        orderId: req.params.orderId
    })
});

router.get('/:orderId', (req, res, next) => {

    res.status(200).json({
        message : 'orders deleted',
    })
});



module.exports = router;