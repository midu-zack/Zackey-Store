const express =require('express');
 
const {  adminLoginPage, adminSubmitlogin } = require('../controllers/admin');
 
const router = express.Router()


router.get('/admin',adminLoginPage);

router.post('/dashboard',adminSubmitlogin)
 

module.exports = router;
