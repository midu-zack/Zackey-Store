const express =require('express');
const { homePage } = require('../controllers/user');
const router = express.Router()


router.get('/',homePage);
// router.get('/login-register',userController.loginPage);
// router.get('/user/otp-register',userController.otpReg);


// router.post('/user/register',userController.submitRegister)
// router.post('/user/login',userController.submitLogin)


// router.post('/send-otp', userController.sendOTP);
// router.post('/verify-otp', userController.verifyOTP);


module.exports = router;
