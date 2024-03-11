const express = require("express");
const { addProduct, productAdding, listProduct } = require("../controllers/product");
const router = express.Router()

router.get("/addProduct",addProduct)
router.get("/listProduct",listProduct)

router.post("/addProduct",productAdding)



module.exports = router;