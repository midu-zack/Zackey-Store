const express =require('express');
const { showCart,addCart, updateQuantity, removeProductCart} = require('../controllers/cart');
const router = express.Router()
const verifyToken = require('../middleware/jwtmiddleware');
 
router.get('/cart',verifyToken,showCart)

router.get('/addCart/:id',verifyToken ,addCart)
router.post('/updateQuantity',verifyToken,updateQuantity)

router.get('/deleteProductCart/:id',removeProductCart)

module.exports = router;
