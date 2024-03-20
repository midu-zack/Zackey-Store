const express =require('express');
const {addCart} = require('../controllers/cart');
const router = express.Router()
const verifyToken = require('../middleware/jwtmiddleware');
 
router.get('/addCart/:id',verifyToken ,addCart)
// router.get('/deleteProductCart/:id',removeProductCart)

module.exports = router;
