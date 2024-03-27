const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/jwtmiddleware");

const {addAddress,showCheckout, placeOrder } = require("../controllers/checkout");


router.get("/checkout", verifyToken, showCheckout);
router.post("/addAddress", verifyToken, addAddress);

router.post('/placeOrder',verifyToken,placeOrder)




module.exports  = router;