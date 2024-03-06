const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  
  
   categorie :{
    type:String
   }

});

 
const Categorie = mongoose.model('Categorie', adminSchema);

module.exports = Categorie; // export the module