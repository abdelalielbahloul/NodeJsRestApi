const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
    try{ // we tried to verify if the request incomming has a valid token if not we return an error 
        const token = req.headers.authorization.split(" ")[1]; //getting the token passed in authorization header
        const decode = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decode;
        next();
    }catch(error){
        return res.status(401).json({
            message: 'Auth failed'
        })
    }
}