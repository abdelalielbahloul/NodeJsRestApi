const Order = require('../models/order');
const Product = require('../models/product');
const mongoose = require('mongoose');
var url = 'http://localhost:3000/orders';


exports.index = (req, res, next) => {

    Order.find().select('_id productId quantite')
        .populate('productId', 'name price').exec()
        .then( docs => {
            const response = {
                count : docs.length,
                orders: docs.map(doc => {
                    return {
                        _id : doc._id,
                        product: doc.productId,
                        quantite: doc.quantite,
                        details: {
                            method: 'GET',
                            url: `${url}/${doc._id}`
                        }
                    }
                })
            }
            res.status(200).json(response);
        })
        .catch( err => {
            res.status(500).json({
                error: err
            })
        }); 
};

exports.create = (req, res, next) => {

    Product.findById(req.body.product)
        .then( () => {
            
            const order = new Order({
                _id: new mongoose.Types.ObjectId(),
                productId: req.body.product,
                quantite: req.body.quantite
            });
            order.save()
                .then( result => {
                    res.status(201).json({
                        message : 'order stored successfully!',
                        createdOrder: {
                            _id: result._id,
                            productId: result.product,
                            quantite: result.quantite,
                            details:{
                                method: 'GET',
                                url: `${url}/${result._id}`
                            }
                        }
                    })
                })
                .catch( err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    })
                });
        })
        .catch( err => {
            res.status(404).json({
                message: "Product Not found",
                error: err
            });
        });    
};

exports.show =  (req, res, next) => {

    const id = req.params.orderId;
    Order.findById(id).select('_id productId quantite')
        .populate('productId', 'name price').exec()
        .then( doc => {
            if(doc){
                res.status(200).json({
                    _id:doc._id,
                    quantite: doc.quantite,
                    product:doc.productId
                })
            }else{
                res.status(404).json({ message: 'Not found' })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
};

exports.delete = (req, res, next) => {

    const id = req.body.orderId;
    Order.remove({ _id : id}).exec()
        .then( () => {
            res.status(200).json({
                message : "order was deleted successfully!",
                details:{
                    description: 'you can store other orders',
                    method: 'POST',
                    url: `${url}`,
                    body:{
                        productId: 'ObjectId(id)',
                        quantite: 'Number'
                    }

                }
            })
        })
        .catch( err => {
            res.status(200).json({
                error: err
            })
        });
}