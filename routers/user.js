const express =require('express');
const { homePage, showShop, addCart, logout , account} = require('../controllers/user');
const router = express.Router()
const verifyToken = require('../middleware/jwtmiddleware');
// const userController = require('../controllers/user')
 

router.get('/',homePage);

// router.get('/account',account)

router.get('/profile',verifyToken,account)

router.get('/logout',logout)

router.get('/shop',showShop)

router.get('/addCart',addCart)

module.exports = router;
