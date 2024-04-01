const express = require("express");
const { homePage, showShop, logout, account, blockUnblock, getOrderDetails, cancelOrder } = require("../controllers/user");
const router = express.Router();
const verifyToken = require("../middleware/jwtmiddleware");
 

router.get("/", homePage);

// router.get('/account',account)

router.get("/profile",verifyToken,account);

router.get("/logout", logout);

router.get("/shop", showShop);

router.post("/userBlock",blockUnblock)

router.get("/getOrderDetails",getOrderDetails)

router.post("/cancelOrder",cancelOrder)

module.exports = router;
