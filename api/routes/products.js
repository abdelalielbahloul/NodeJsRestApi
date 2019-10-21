const express = require('express');

const router = express.Router();

const mongoose = require('mongoose');

const Product = require('../models/product'); //import the model class of product
var url = 'http://localhost:3000/products';

router.get('/', (req, res, next) => {

    Product.find().select('_id name price').exec()
        .then (docs => {
            const response = {
                count : docs.length,
                products: docs.map( doc => {
                    return {
                        _id : doc._id,
                        name : doc.name,
                        price : doc.price,
                        details:{
                            method: 'GET',
                            url: `${url}/${doc._id}`
                        }
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

    // res.status(200).json({
    //     message : 'This inside a req /product get methode'
    // })
});

router.post('/', (req, res, next) => {

    const product =  new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product.save()
        .then( result => {
            res.status(201).json({
                message : 'product was created successfully!',
                createdProduct: {
                    _id: result._id,
                    name: result.name,
                    price: result.price,
                    details:{
                        method: 'GET',
                        url: `${url}/${result._id}`
                    }
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err})
        });

   
});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id).select('_id name price').exec()
        .then(doc =>{
            if(doc){
                res.status(200).json(doc);
            }else{
                res.status(404).json({message: "Not found"});
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err});
        });
});

router.patch('/:productId', (req, res, next) => {
   const id = req.params.productId;
   const newProduct = req.body;
   Product.update({ _id : id}, { $set: newProduct}).exec()
        .then( result => {
            res.status(200).json({
                message: 'product was updated successfully!',
                updatedProduct:{
                    method: 'GET',
                    url: `${url}/${id}`
                }
            })
        })
        .catch( err => {
            console.log(err);
            res.status(500).json({
                error : err
            })
        });
  
});

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findByIdAndRemove({ _id : id})
        .then(result => {
            res.status(200).json({
                message : "product was deleted successfully!",
                details:{
                    description: 'you can create an other product',
                    method: 'POST',
                    url: `${url}`,
                    body:{
                        name: 'String',
                        price: 'Number'
                    }

                }
            })
        })
        .catch( err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
});



module.exports = router;