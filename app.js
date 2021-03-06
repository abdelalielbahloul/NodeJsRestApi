require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan'); //it's handling all our requests that we did like a history of our requests
const bodyParser = require('body-parser'); // it's uses to parse an incoming requests
const mongoose = require('mongoose'); //import mongoose package to connect with db
var moesif = require('moesif-express');

// 2. Set the options, the only required field is applicationId
var moesifMiddleware = moesif({
  applicationId: process.env.APP_ID,
  
  // Set to false if you don't want to capture payloads
  logBody: true,

  // Optional hook to link API calls to users
  identifyUser: function (req, res) {
    return req.user ? req.user.id : undefined;
  },
  getSessionToken: (req, res) => {
    return req.headers['Authorization'];
  }
});

//all routes that we have
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');
mongoose.set('useNewUrlParser', true);
// const url = 'mongodb://localhost:27017/sygemt';
const options = {
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true,
    autoIndex: true, // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0,
    connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
  };
mongoose.connect(process.env.DATABASE, options).catch(error => handleError(error));
mongoose.Promise = global.Promise;

// Skip this step if you don't want to capture outgoing API calls
moesifMiddleware.startCaptureOutgoing();
app.use(morgan('tiny'));
app.use('/uploads',express.static('uploads'));  //add a midellware to make the folder uploads public for access in every where ( and display images in url) 
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
// 3. Enable the Moesif middleware to start capturing incoming API Calls
app.use(moesifMiddleware);


//give access to any request incomming and witch headers are allowed

app.use( (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'GET, PUT, DELETE, PATCH, POST');
        return res.status(200).json({});
    }

    next();
});

//the url of our rest api
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);


//a error for an incoming request doesnt exist in api/routes

app.use( (req, res, next) => {
    const err = new Error('Not found');

    res.status = 404;
    next(err)
});

app.use( (err, req, res, next) => {

    res.status = err.status || 500;
    res.json({
        error: {
            message : err.message
        }
    });
});


module.exports = app;