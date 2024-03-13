const express = require("express");
const { addProduct, productAdding, listProduct, deleteProduct, editProduct, updateProduct } = require("../controllers/product");
const upload = require("../config/multer");
const router = express.Router()

router.get("/addProduct",addProduct)
router.get("/listProduct",listProduct)

router.get("/editProduct/:id",editProduct)

router.post("/editProduct/:id",upload.single("image"),updateProduct)


router.get("/deleteProduct/:id",deleteProduct)



router.post("/addProduct",upload.single("image"),productAdding)



module.exports = router;