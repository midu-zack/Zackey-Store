const User = require("../model/user");
const Product = require("../model/product");
const Category = require("../model/categorie");

// get homepage
let homePage = async (req, res) => {
  try {
    const products = await Product.find();
    res.render("user/index", { products });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .render("error", { message: "Internal Server Error in home page" });
  }
};

// get shop page
let showShop = async (req, res) => {
  try {
    const categories = await Category.find();
    const products = await Product.find();
    res.render("user/shop-fullwide", { products, categories });
  } catch (error) {
    console.error(error);
    res.status(500).render("error", {
      message:
        "An error occurred while fetching shop data. Please try again later.",
    });
  }
};

// get myAccount
const account = async (req, res) => {
  try {
    // Ensure req.user exists and contains the user ID
    if (!req.user.id) {
      return res.status(401).render("user/login-register");
    }

    const userId = req.user.id;

    const user = await User.findById(userId);

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
  res.clearCookie("jwt"); // Clear the JWT cookie
  // res.clearCookie('userId')
  res.redirect("/"); // Redirect to login page or any other appropriate page
};

const blockUnblock = async (req, res) => {
  const userId = req.body.userId;

  try {
    const user = await User.findOne({ _id: userId });

    if (user) {
      user.blocked = !user.blocked;
      await user.save();

      console.log("block status :", user.blocked);
    }
    res.redirect("/customersList");
  } catch (error) {
    res.status(500).send("admin is changing the user status");
  }
};

module.exports = {
  homePage,
  showShop,
  logout,
  account,
  blockUnblock,
};
