const express =require('express');
 
const {  adminLoginPage, adminSubmitlogin, adminLogout, dashboard, orderList, orderDetails, orderStatus } = require('../controllers/admin');
 
 
const router = express.Router()


router.get('/admin',adminLoginPage);
router.get('admin/logout',adminLogout);

router.get('/dashboard',dashboard)

router.post('/dashboard',adminSubmitlogin)

router.get("/orderList",orderList)
router.get("/orderDetails/:id",orderDetails)

router.post("/orderStatus",orderStatus)
// router.get('/categorie',categorieListShow)

// router.get('/sales', getSalesData);
 

module.exports = router;
