const express =require('express');
const { homePage, account } = require('../controllers/user');
const router = express.Router()


router.get('/',homePage);
router.get('/account',account)

module.exports = router;
