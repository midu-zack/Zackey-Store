const User = require("../model/user");
const Product = require("../model/product")
const Category = require("../model/categorie");

// get homepage
let homePage = async (req, res) => {
  try {
    // const user = req;
    const products = await Product.find();
    res.render('user/index',{products} );
  } catch (error) {
     
    res.status(500).send('Internal Server Error in home page');
  }
}

 

// get shop page
let showShop = async(req,res)=>{
  try {
    const categories = await Category.find();
    const products = await Product.find();
    res.render('user/shop-fullwide',{products,categories})
  } catch (error) {

    console.log(error);
    
  }
}


// get myAccount
const account = async (req, res) => {
  try {
    const userId = req.user.id;

    console.log("this is account user  ",req.user);

    if (!userId) {
      return res.status(401).render("user/login-register");
    }

    const user = await User.findById(userId);

    // Check if user exists
    if (!user) {
      return res.status(404).send("User not found");
    }

    res.render("user/my-account", { user });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).send("Internal Server Error");
  }
};

 
// logout user
const logout = (req, res) => {
  res.clearCookie('jwt'); // Clear the JWT cookie
  // res.clearCookie('userId')
  res.redirect('/'); // Redirect to login page or any other appropriate page
};



 
module.exports ={
    homePage ,
    showShop,
    logout,
    account

} 