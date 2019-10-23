const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const productController = require('../controllers/productsController');
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


router.get('/', productController.index);

router.post('/',  checkAuth, upload.single('productImage'), productController.create);

router.get('/:productId', productController.show);

router.patch('/:productId', checkAuth, productController.update);

router.delete('/:productId', checkAuth, productController.delete);

module.exports = router;