/*  
here we create an model to our user how are
*/

const mongoose = require('mongoose');

const userScheme = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId, //we use a propriete of mongosse to give for any order an id like 'ad5h5jd5jsl5jddk8kd'
    email: { type: String, 
        required: true, 
        unique: true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    password: { type: String, required: true}
});

module.exports = mongoose.model('User', userScheme); //we export that schema to use it in our app.js in the folder routes