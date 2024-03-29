const User = require("../model/user");
const Product = require("../model/product");


const wishlist = async (req,res)=>{
  try {
      const userId = req.user.id;
        
       if (!userId) {
           return res.render("user/login-register");
       }

       const user = await User.findById(userId).populate('wishlist.items');

       res.render('user/wishlist', { wishlistItems: user.wishlist });
   } catch (error) {
       console.error('Error fetching wishlist items:', error);
       res.status(500).send('Internal Server Error');
   }


}

const addToWishlist = async (req,res)=>{
    try {
        const productId = req.params.id;
        const userId = req.user.id;

        // Check if the user is authenticated
        if (!userId) {
            return res.render('user/login-register');
        }

        // Update the user's document to add the product ID to the wishlist array
          const updatedUser = await User.findOneAndUpdate(
            { _id: userId,'wishlist.items': { $ne: productId } }, // Check if the product is not already in the cart
            { $addToSet: { wishlist: { items: productId, wishlist: true } } }, // Update the 'cart' field to true
            { new: true }
        );

        if (updatedUser) {
            return res.redirect('/Shop?success=addedToWishlist');
        }
         else {
            return res.redirect(`/Shop?failed=ItemIsAlreadyInWishList&productId=${productId}`);
        }
        
    } catch (error) {
        console.error('Error adding product to wishlist:', error);
        res.status(500).send('Internal Server Error');
    }
}


const DeleteWishList = async (req, res) => {
    const productId = req.params.id;

    try {
        const updatedUserWishlist = await User.findOneAndUpdate(
            { 'wishlist.items': productId },
            { $pull: { wishlist: { items: productId } } },
            { new: true }
        );
     
        if (!updatedUserWishlist) {
            return res.status(404).send('Product not found in wishlist');
        }

        // Redirect to the wishlist page after deletion
        res.redirect('/Wishlist?success');
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = {
    wishlist,
    addToWishlist,
    DeleteWishList,
}