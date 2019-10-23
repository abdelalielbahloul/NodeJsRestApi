const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/')
    },
    filename: function (req, file, cb) { 
        cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname)
    }
});
const fileFilter = (req, file, cb ) => {

    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        // To accept the file pass `true`, like so:
        cb(null, true);
        return;
    }else{
        // To reject this file pass `false`, like so:
        cb(null, false);
        cb( new Error('The file mime type is not acceptable'))       
    }

};
const upload = multer({ 
    storage: storage, 
    limits: {
        fileSize : 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});
const Product = require('../models/product'); //import the model class of product
var url = 'http://localhost:3000/products';

router.get('/', (req, res, next) => {

    Product.find().select('_id name price productImage').exec()
        .then (docs => {
            const response = {
                count : docs.length,
                products: docs.map( doc => {
                    return {
                        _id : doc._id,
                        name : doc.name,
                        price : doc.price,
                        image : doc.productImage,
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
});

router.post('/',  checkAuth, upload.single('productImage'), (req, res, next) => {

    console.log(req.file);
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

   
});

router.get('/:productId', (req, res, next) => {
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
});

router.patch('/:productId', checkAuth, (req, res, next) => {
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
  
});

router.delete('/:productId', checkAuth, (req, res, next) => {
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
});



module.exports = router;