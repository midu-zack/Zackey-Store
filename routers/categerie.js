const express =require('express');

const { categorieListShow, categorieAddShow, submitAddCategory, categoryEdit } = require('../controllers/categorie');

const router = express.Router()

router.get('/categorie',categorieListShow)
router.get('/addCategorie',categorieAddShow)

router.post("/addCategorie",submitAddCategory)

router.get("/categorieEdit/:id",categoryEdit)
router.post("/categorieEdit/:id",categoryEdit)

module.exports = router;