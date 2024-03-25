const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/jwtmiddleware");
const { wishlist, addToWishlist, DeleteWishList } = require("../controllers/wishlist");


router.get('/wishlist',verifyToken,wishlist)
router.get('/wishlist/:id',verifyToken,addToWishlist)
router.get('/DeleteWishlist/:id', verifyToken,DeleteWishList)

module.exports = router;
