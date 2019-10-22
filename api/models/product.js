/*  
here we create an model to our products how are like (describe the products)
*/

const mongoose = require('mongoose');

const productScheme = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId, //we use a propriete of mongosse to give for any product an id like 'ad5h_5jd5jsl5jddk8kd'
    name: { type: String, required: true },
    price: { type: Number, required: true },
    productImage: { type: String, required: true}
});

module.exports = mongoose.model('Product', productScheme); //we export that schema to use it in our app.js in the folder routes