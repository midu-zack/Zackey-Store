const express =require('express');

const { categorieListShow, categorieAddShow } = require('../controllers/categorie');

const router = express.Router()

router.get('/categorie',categorieListShow)
router.get('/addCategorie',categorieAddShow)

module.exports = router;