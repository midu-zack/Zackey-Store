const express =require('express');

const { categorieListShow, categorieAddShow, submitAddCategory, categoryEdit, categoryUpdate , categoryDelete} = require('../controllers/categorie');

const router = express.Router()

router.get('/categorie',categorieListShow)
router.get('/addCategorie',categorieAddShow)

router.post("/addCategorie",submitAddCategory)

router.get("/categorieEdit/:id",categoryEdit)
// router.post("/categorieEdit/:id",categoryEdit)

router.post("/categorieEdit/:id",categoryUpdate)

router.post("/categorieDelete/:id",categoryDelete)

module.exports = router;