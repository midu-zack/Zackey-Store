const Categorie = require('../model/categorie')

let categorieListShow = (req, res) => {
    try {
      res.render('admin/categorie-list');
    } catch (error) {
      console.error(error ,"rendering login page ");
      res.status(500).send('Internal Server Error in home page');
    }
  }

  let categorieAddShow = (req, res) => {
    try {
      res.render('admin/categories-add');
    } catch (error) {
      console.error(error ,"rendering login page ");
      res.status(500).send('Internal Server Error in home page');
    }
  }

  module.exports = {
    categorieListShow,
    categorieAddShow
  }