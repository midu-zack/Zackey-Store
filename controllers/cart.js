const User = require("../model/user");
const Product = require("../model/product");

const showCart = async (req, res) => {
  try {
    const userId = req.user.id;

  
    if (!userId) {
      return res.render("user/login-register");
    }

    // Find the user by ID and populate the bookings array with product details
    const user = await User.findById(userId).populate("bookings.product");

    if (!user) {
      return res.render("user/login-register");
    }

    // Render the cart page with the user's bookings
    res.render("user/cart", {
      bookings: user.bookings,
      subtotal: user.subtotal,
      grandtotal: user.grandtotal,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const addCart = async (req, res) => {
  const productId = req.params.id;
  const userId = req.user.id; // Corrected to use req.user.id
 
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId, "bookings.product": { $ne: productId } }, // Check if the product is not already in the cart
      { $addToSet: { bookings: { product: productId, cart: true } } }, // Update the 'cart' field to true
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

module.exports = {
  showCart,
  addCart,
  updateQuantity,
  removeProductCart,
};
