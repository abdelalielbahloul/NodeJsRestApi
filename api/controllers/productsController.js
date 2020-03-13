require('dotenv').config();
const Product = require('../models/product'); //import the model class of product
const mongoose = require('mongoose');
var url = `${process.env.BASE_URL}:${process.env.PORT}/products`;

exports.index = (req, res, next) => {

    Product.find().select('_id name price productImage').exec()
        .then (docs => {
            const response = {
                count : docs.length,
                products: docs.map( doc => {
                    return {
                        _id : doc._id,
                        name : doc.name,
                        price : doc.price,
                        image : `${process.env.BASE_URL}:${process.env.PORT}/${doc.productImage}`,
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
};

exports.create =  (req, res, next) => {

    // console.log(req.file);
    const product =  new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product.save()
        .then( result => {
            res.status(201).json({
                message : 'product was created successfully!',
                createdProduct: {
                    _id: result._id,
                    name: result.name,
                    price: result.price,
                    image: result.productImage,
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

   
};

exports.show = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id).select('_id name price productImage').exec()
        .then(doc =>{
            if(doc){
                res.status(200).json({
                    _id:doc._id,
                    name: doc.name,
                    price:doc.price,
                    image: doc.productImage
                });
            }else{
                res.status(404).json({message: "Not found"});
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err});
        });
};

exports.update = (req, res, next) => {
    const id = req.params.productId;
    const newProduct = req.body;
    Product.updateOne({ _id : id}, { $set: newProduct}).exec()
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
   
};

exports.delete = (req, res, next) => {
const id = req.params.productId;
Product.findByIdAndRemove({ _id : id})
    .then(() => {
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
};