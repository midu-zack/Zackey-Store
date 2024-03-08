const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  
  
   categorie :{
    type:String
   },
   createdAt :{
      type:Date,
      default:Date.now}

});

 
const Categorie = mongoose.model('Categorie', adminSchema);

module.exports = Categorie; // export the module