const User = require("../model/user");
const Product = require("../model/product");
 
const addCart = async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.user.id;

    console.log('this is productID', productId);
    console.log('this is jwt userId', userId);

    
    if (!userId) {
      return res.render('user/login-register');
    }

 
    const products = await Product.findById(productId)

    console.log("this is products in cart",products);
    const user = await User.findById(userId) 

    if(!user){
      return res.render('user/login-register')
    }
  
    res.render("user/cart",{products});

  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

// let removeProductCart = async (req,res)=>{
   

//   try {
//     const productId = req.params.id; 
     
//     const cartProduct = await Product.findByIdAndDelete(productId);

//     console.log(cartProduct);
 
//     res.status(200).render('user/cart')

//   } catch (error) {
//     console.error("Error deleting Product from cart:", error);
//     res.status(500).json({ message: "An error occurred while deleting the Product" });
//   }


// }


module.exports = {
  addCart,
  // removeProductCart
};
