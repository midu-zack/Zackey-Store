const express = require("express");
const { addProduct, productAdding, listProduct, deleteProduct, updateProduct } = require("../controllers/product");
const upload = require("../config/multer");
const router = express.Router()

router.get("/addProduct",addProduct)
router.get("/listProduct",listProduct)

router.post("/editProduct/:id",updateProduct)
router.get("/deleteProduct/:id",deleteProduct)



router.post("/addProduct",upload.single("image"),productAdding)



module.exports = router;