const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const bcryptjs = require('bcryptjs');

router.post('/signup', (req, res, next) => {
    bcryptjs.hash(req.body.password, 10, (err, hash) => {
        if(err){
            if(req.body.email === undefined || hash === undefined){
                return res.status(500).json({
                    message : 'An error has occured!'
                })
            }
           
        }else{
            const user = new User({
                _id : new mongoose.Types.ObjectId(),
                email : req.body.email,
                password : hash
            });
            user.save()
                .then( result => {
                    console.log(result);

                    res.status(201).json({
                        message: 'User created successfully!'
                    })
                })
                .catch( err => {
                    
                    if(err){
                        if(err){
                            res.status(409).json({
                                error: err
                            })
                        }
                        
                    }
                   
                });
        }
    })
    
});

router.delete('/:userId', (req, res, next) => {
    User.deleteOne({ _id: req.params.userId}, errors => {
        if(errors){
            res.status(404).json({
                message: "User not found!"
            })
        }
        
    })
    .exec()
    .then(result => {
        res.status(200).json({
            message: "User has been deleted!"
        })
    })
    .catch(err => {
        res.status(500).json({
            message: "An error has occured!",
            error: err
        })
    });
})



module.exports = router;