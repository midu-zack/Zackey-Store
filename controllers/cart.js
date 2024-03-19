
const User = require("../model/user");
const Product = require("../model/product")
const Category = require("../model/categorie");


// add to cart page 
const addCart = async (req, res) => {
  try {
      // const userId = req.params.id; 

      // if (!userId) {
      //     // If userId parameter is missing or invalid, render the login/register page
      //     return res.render('user/login-register');
      // }
      
      // // Assuming you have a User model
      // const user = await User.findById(userId);

      // if (!user) {
      //     // If user with the provided ID is not found, render the login/register page
      //     return res.render('user/login-register');
      // }

      // User found, render the cart page

      res.render("user/cart");
  } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
  }
};

module.exports = addCart;


  module.exports = {
    addCart
  }