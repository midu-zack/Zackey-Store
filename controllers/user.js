const User = require("../model/user");
const Product = require("../model/product");
const Category = require("../model/categorie");
const jwt = require("jsonwebtoken");
require("dotenv").config();


// get homepage
let homePage = async (req, res) => {

    const token = req.cookies.jwt;

  if (!token) {
    return res.render("user/index");
  }
    try {
   
      const decoded = jwt.verify(token, process.env.JWT_KEY);
      req.user = decoded;
      

      // console.log("req.user", req.user);

      const user = await User.findOne({_id:req.user.id})
      const products = await Product.find();
       
     return  res.render("user/index", { products, user});
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .render("error", { message: "Internal Server Error in home page" });
    }
  }


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




const getOrderDetails = async (req, res) => {
  try {
      const orderId = req.query.orderId; 
      const user = await User.findOne({ 'orders.orderId': orderId });

      const order = user.orders.find(order => order.orderId === orderId);
      if (!order) {
          return res.status(404).json({ error: 'Order not found in user\'s orders array' });
      }

  // If order found, return the order details
  res.json(order);

      }  catch(error){
    console.error(error);
    res.status(500).json({ error: 'Error fetching order details' });
  }};



  const cancelOrder = async (req, res) => {
    try {
        const orderId = req.query.orderId; 
        const user = await User.findOne({ 'orders.orderId': orderId });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const order = user.orders.find(order => order.orderId === orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Update order status to "Cancelled"
        order.status = 'Cancelled';
        await user.save();

        res.json({ message: 'Order cancelled successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error cancelling order' });
    }
};


module.exports = {
  homePage,
  showShop,
  logout,
  account,
  blockUnblock,
  getOrderDetails,
  cancelOrder,
};
