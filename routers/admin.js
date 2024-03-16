const express =require('express');
 
const {  adminLoginPage, adminSubmitlogin, adminLogout } = require('../controllers/admin');
 
 
const router = express.Router()


router.get('/admin',adminLoginPage);
router.get('admin/logout',adminLogout);

router.post('/dashboard',adminSubmitlogin)

// router.get('/categorie',categorieListShow)
 

module.exports = router;
