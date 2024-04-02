const express =require('express');
const { showCart,addCart, updateQuantity, removeProductCart, clearCart} = require('../controllers/cart');
const router = express.Router()
const verifyToken = require('../middleware/jwtmiddleware');
 
router.get("/cart" ,verifyToken,showCart)

router.get('/addCart/:id',verifyToken ,addCart)
router.post('/updateQuantity',verifyToken,updateQuantity)

router.get('/deleteProductCart/:id',removeProductCart)
router.get('/clearToCart',verifyToken,clearCart)

module.exports = router;
