const Categorie = require('../model/categorie')

let categorieListShow = async (req, res)=>{
    try {
      const category = await Categorie.find()
      res.render('admin/categorie-list',{category});
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
      
      const { name }=req.body
      const newCategorie = new Categorie ({
        categorie : name 
      })
      await newCategorie.save();
      const category = await Categorie.find()
      res.status(201).render('admin/categorie-list',{category});
      
    }catch(error){
      console.error('Error saving Categorie:', error);
      res.status(500).json({ message: 'An error occurred while saving the Categorie' });

    }
  }

   

let categoryEdit = async (req,res)=>{
  try{

    let categoryId = req.params.id;

    console.log("categoryId", categoryId);

     
    let category = await Categorie.findOne();

    let categorieName = category.categorie 

    

    if(!categorieName){
      res.status(400).send(' Not Found')
    }
    res.render('admin/categories-edit',{categorieName});


  }catch(error){
    res.status(500).send('Internal Server Error in category Edit')
  }
}



  module.exports = {
    categorieListShow,
    categorieAddShow,
    submitAddCategory,
    categoryEdit,
  }