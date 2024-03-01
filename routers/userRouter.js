const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')


router.get('/',userController.homePage);
router.get('/login-register',userController.loginPage);
// router.get('/user/login',userController.loginPage);


router.post('/user/register',userController.submitRegister)
router.post('/user/login',userController.submitLogin)


module.exports = router;
