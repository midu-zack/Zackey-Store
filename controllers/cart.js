const User = require("../model/user");
const Product = require("../model/product");

const showCart = async (req, res) => {

  try {
    const userId = req.user.id;

  
    if (!userId) {
      return res.render("user/login-register");
    }

    console.log('this is useri',userId);

    // Find the user by ID and populate the bookings array with product details
    const user = await User.findById(userId).populate("bookings.product");

    if (!user) {
      return res.render("user/login-register");
    }

    let subtotal = 0;
    user.bookings.forEach(booking => {
        subtotal += booking.quantity * booking.product.price;
    });

    user.subtotal = subtotal;

    user.grandtotal = user.subtotal + user.shippingcost;

    await user.save();

    // console.log('this is grand total ',grandtotal);
    // Render the cart page with the user's bookings
    res.render("user/cart", {
      bookings: user.bookings,
      subtotal: user.subtotal,
      grandtotal: user.grandtotal,
    });

    // console.log('this is render  subtotal and grand : ' , subtotal,grandtotal);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const addCart = async (req, res) => {
  const productId = req.params.id;
  const userId = req.user.id; // Corrected to use req.user.id


 
  try {

    const product = await Product.findById(productId);
    if (!product) {
        return res.status(404).send('Product not found');
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId, "bookings.product": { $ne: productId } }, // Check if the product is not already in the cart
      { $addToSet: { bookings: { productName : product.name , product: productId, cart: true } } }, // Update the 'cart' field to true
      { new: true }
    );

     if (updatedUser) {
      res.redirect("/shop?success=addedToCart");
    } else {
      res.redirect("/Shop?failed=ItemIsAlreadyInCart");
    }
  } catch (error) {
    // Handle errors
    console.error("Error adding product to cart:", error);
    res.status(500).send("Internal Server Error");
  }
};

let updateQuantity = async (req, res) => {
  try {
    const { productId, newQuantity } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);

    const bookings = user.bookings.find(
      (bookings) => bookings.product.toString() === productId
    );

    if (bookings) {
      bookings.quantity = newQuantity;
    } else {
      return res.status(404).json({ message: "booking not found" });
    }

    await user.save();

    res
      .status(200)
      .json({ message: "Quantity update successfully", newQuantity });
  } catch (error) {
    console.error("Error updating quantity:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const removeProductCart = async (req, res) => {
  try {
    const productId = req.params.id;
    const updatedUserCart = await User.findOneAndUpdate(
      { "bookings.product": productId },
      { $pull: { bookings: { product: productId } } },
      { new: true }
    );

    if (!updatedUserCart) {
      return res.status(404).send("Product not found in cart");
    }

    // Redirect to the cart page after deletion
    res.redirect("/cart");
  } catch (error) {
    console.error("Error deleting product from cart:", error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the product" });
  }
};


const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the user by ID and clear the bookings array
    const updatedUser = await User.findByIdAndUpdate(userId, { bookings: [] }, { new: true });

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    res.redirect("/cart");
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  showCart,
  addCart,
  updateQuantity,
  removeProductCart,
  clearCart,
};
