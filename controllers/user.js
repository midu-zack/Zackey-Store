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
    console.error(error ,"rendering homage  ");
    res.status(500).send('Internal Server Error in home page');
  }
}


// get userAccount
let account = async (req,res)=>{
  try {
  let userId = req.body.id;
  console.log("this is id user account id" , userId);
  let user = await User.findOne({_id:userId})
  console.log("getting the user details :" , user);
  if(!user){
    return res.status(400).send("user not found")
  }
  
    res.render("user/my-account")

  } catch (error) {

    console.log(error);
    
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
// get myaccount
// let profile = async (req, res) => {
//   let userId = req.user.id;
//   let user = await User.findOne({ _id: userId });
//   console.log(user,'getting the user details');
//   if (!user) {
//       return res.status(400).send('User not found');
//   }
//   res.render('user/profile', {user});
// }

 
module.exports ={
    homePage ,
    account,
    showShop

} 