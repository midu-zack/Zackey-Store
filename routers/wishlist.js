const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/jwtmiddleware");
const { wishlist, addToWishlist } = require("../controllers/wishlist");


router.get('/wishlist',verifyToken,wishlist)
router.get('/wishlist/:id',verifyToken,addToWishlist)


module.exports = router;
