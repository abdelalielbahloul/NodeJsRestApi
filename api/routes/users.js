const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

router.post('/signin', (req, res, next) => {
    User.find({email : req.body.email})
        .exec()
        .then( user => {
            if(user.length < 1){
                res.status(401).json({
                    message: 'Auth failed!'
                })
            }
            bcryptjs.compare(req.body.password, user[0].password, (er, result) => {
                if(er){
                    return res.status(401).send({
                        message: 'Auth failed'
                    })
                }
                if(result){
                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id
                    },
                    process.env.JWT_KEY,
                    {
                        expiresIn: '1H'
                    });

                    return res.status(200).json({
                        message: 'Auth successful !',
                        token: token
                    })
                }
                return res.status(401).json({
                    message: 'Auth failed'
                })
            })
        })
        .catch( err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
})

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