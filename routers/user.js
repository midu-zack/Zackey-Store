const express =require('express');
const { homePage } = require('../controllers/user');
const router = express.Router()


router.get('/',homePage);
 

module.exports = router;
