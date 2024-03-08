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

  const submitAddCategory = async (req,res)=>{
    try{
      const {name}=req.body
      const newCategorie = new Categorie ({
        categorie : name 
      })
      await newCategorie.save();

      res.status(201).render('admin/categorie-list');
      
    }catch(error){
      console.error('Error saving Categorie:', error);
      res.status(500).json({ message: 'An error occurred while saving the Categorie' });

    }
  }

  module.exports = {
    categorieListShow,
    categorieAddShow,
    submitAddCategory
  }