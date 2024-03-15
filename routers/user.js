const express =require('express');
const { homePage, account, showShop, addCart } = require('../controllers/user');
const router = express.Router()


router.get('/',homePage);
router.get('/account',account)
router.get('/shop',showShop)

router.get('/addCart',addCart)

module.exports = router;
