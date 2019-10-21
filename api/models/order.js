/*  
here we create an model to our orders how are like (describe the orders)
*/

const mongoose = require('mongoose');

const orderScheme = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId, //we use a propriete of mongosse to give for any order an id like 'ad5h5jd5jsl5jddk8kd'
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantite: { type: Number, default: 1 }
});

module.exports = mongoose.model('Order', orderScheme); //we export that schema to use it in our app.js in the folder routes