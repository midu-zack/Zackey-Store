const express =require('express');
const { homePage, account, showShop } = require('../controllers/user');
const router = express.Router()


router.get('/',homePage);
router.get('/account',account)
router.get('/shop',showShop)

module.exports = router;
