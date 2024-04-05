const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/jwtmiddleware");
const { addAddress, showCheckout, placeOrder, capturePayment, createRazorpayOrder, saveRazorpayResponse } = require("../controllers/checkout");

 
router.get("/checkout", verifyToken, showCheckout);

router.post("/addAddress", verifyToken, addAddress);
 
router.post('/placeOrder', verifyToken, placeOrder);

router.post('/createRazorpayOrder',verifyToken, createRazorpayOrder);

// router.post('/saveRazorpayResponse', saveRazorpayResponse);
 

module.exports = router;
