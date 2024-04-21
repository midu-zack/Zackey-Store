const express = require("express");
const { homePage, showShop, logout, account, blockUnblock, getOrderDetails, cancelOrder, deleteAddress, priceFiltration, forgotPasswordRendring, checkEmail, verifyOTP, verifyOTPRendring, passwordChangeRendring, passwordChange } = require("../controllers/user");
const router = express.Router();
const verifyToken = require("../middleware/jwtmiddleware");
// const { otpReg } = require("../controllers/auth");
 

router.get("/",  homePage);

// router.get('/account',account)

router.get("/profile",verifyToken,account);

router.get("/logout", logout);

router.get("/shop", showShop);

router.post("/userBlock",blockUnblock)

router.get("/getOrderDetails",getOrderDetails)

router.post("/cancelOrder",cancelOrder)

router.delete("/deleteAddress/:id",verifyToken,deleteAddress)

router.post("/priceFilter",priceFiltration)

router.get("/forgotPassword",forgotPasswordRendring)
router.get('/checkEmail', checkEmail);

// router.get("/otpCheck",verifyOTPRendring)
router.post("/otpCheck",verifyOTP)

// router.get("/passwordChange",passwordChangeRendring)
router.post("/passwordChange", passwordChange);

// router.get('/auth/register',otpReg);


module.exports = router;
