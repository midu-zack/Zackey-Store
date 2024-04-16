const User = require("../model/user");
const Product = require("../model/product");
const Admin =require("../model/admin")
const Category = require("../model/categorie");
const jwt = require("jsonwebtoken");
const Orders = require("../model/orders");

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

    const user = await User.findOne({ _id: req.user.id });
    const products = await Product.find();

    const admin = await Admin.findOne();

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    return res.render("user/index", { products, user, coupons: admin.coupons  });
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
    const orders = await Orders.find({ orderedBy: req.user.id })
      .populate("products.product", "name")
      .select("products status  total payment date orderId")
      .sort({ createdAt: -1 }) //latest first it will come
      .lean();

    // console.log("this is ", orders);

    res.render("user/my-account", { user, orders });
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

      // console.log("block status :", user.blocked);
    }
    res.redirect("/customersList");
  } catch (error) {
    res.status(500).send("admin is changing the user status");
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const orderId = req.query.orderId;
    // console.log(orderId);
    const order = await Orders.findById(orderId).populate(
      "products.product",
      "name "
    );
    if (!order) {
      return res
        .status(404)
        .json({ error: "Order not found in user's orders array" });
    }

    // If order found, return the order details
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching order details" });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { orderId, productId } = req.body;

    const order = await Orders.findById(orderId);

    // Check if the order exists
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    const { products } = order;

    // Find the product within the order by productId
    const product = products.find((item) => String(item.product) === productId);
    console.log("this is product ", product);

    // Check if the product exists within the order
    if (!product) {
      return res.status(404).json({ error: "Product not found in the order" });
    }

    // Update the status of the product to "cancelled"
    product.status = "cancelled";

    // Save the updated order
    await order.save();

    res.json({ message: "Product cancelled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error cancelling product" });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have user data stored in the request object
    const addressId = req.params.id;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the address from the user's address array
    user.address = user.address.filter((address) => address._id != addressId);
    await user.save();

    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({ error: "Internal server error" });
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
  deleteAddress,
};
