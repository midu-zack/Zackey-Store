const express =require('express');

const { categorieListShow, categorieAddShow, submitAddCategory } = require('../controllers/categorie');

const router = express.Router()

router.get('/categorie',categorieListShow)
router.get('/addCategorie',categorieAddShow)

router.post('/addCategorie',submitAddCategory)

module.exports = router;