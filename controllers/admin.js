 
const Admin = require("../model/admin")
const User = require("../model/user")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
dotenv.config()

// ADMIN LOGIN PAGE SHOW
let adminLoginPage = (req, res) => {
    try {
      res.render('admin/admin-login');
    } catch (error) {
      console.error(error ,"rendering login page ");
      res.status(500).send('Internal Server Error in home page');
    }
  }
  
const dashboard = (req,res)=>{
    try {
        res.render("admin/dashboard")
    } catch (error) {
        
    }
}
  let adminLogout = (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).send('Internal Server Error');
            }
            res.redirect('/admin');
        });
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).send('Internal Server Error');
    }
};




// handle login submission
let adminSubmitlogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });

        // console.log(email);

        if (admin) {
            if (password === admin.password) {
                // Generate JWT token
                const token = jwt.sign({
                    id: admin._id,
                    email: admin.email
                },
                    process.env.JWT_KEY, {
                    expiresIn: "24h"
                });

                // Set JWT Token in a cookie
                res.cookie("jwt", token, {
                    httpOnly: true,
                    maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
                    // secure: process.env.NODE_ENV === "production"
                });

                res.render("admin/dashboard")
            } else {
               
                res.render('admin/admin-login', { error: 'Incorrect email or password' });
            }
        } else {
             
            res.render('admin/admin-login', { error: 'Admin not found' });
        }
    } catch (error) {
        
        console.error(error);
        res.render('admin/admin-login', { error: 'An error occurred' });
    }
};



const orderList = async (req,res)=>{
    try {
        const usersAndOrders = await User.find({ orders: { $exists: true, $ne: [] } });

        // console.log('this is userOrder',usersAndOrders);

      res.render("admin/order-list",{usersAndOrders})
    } catch (error) {
      console.error(error);
    }
  }
  

  

  const orderDetails = async (req, res) => {
    try {
        const orderId = req.params.id;
        // console.log("this is the orderId", orderId);

        // Find the user with the specific order and retrieve only the matching order
        const userAndOneOrder = await User.aggregate([
            { $match: { 'orders.orderId': orderId } },
            { $unwind: '$orders' },
            { $match: { 'orders.orderId': orderId } }
        ]);

        if (userAndOneOrder.length === 0) {
            // Handle case where user (and hence order) is not found
            return res.status(404).send("Order not found");
        }

        // console.log("this is my user find the ", userAndOneOrder);

        // Pass the order details to the view

        res.render("admin/order-details", { userAndOneOrder });
    } catch (error) {
        // Handle errors
        console.error("Error fetching order details:", error);
        res.status(500).send("Internal Server Error");
    }
}




// orderStatus
const orderStatus = async (req, res) => {
    try {
        const { statusValue, orderID } = req.body;

        // console.log("this is status value", statusValue,"then you have id ", orderID);

        // Find the user and update the status of the matching order
        const updatedUser = await User.findOneAndUpdate(
            { 'orders.orderId': orderID },
            { $set: { 'orders.$.status': statusValue } },
            { new: true }
        );

        // console.log("this is updausers",updatedUser);
        if (!updatedUser) {
            // Handle case where user or order is not found
            return res.status(404).send("User or Order not found");
        }

        // Redirect or render success page
        // res.render("admin/order-list");
        res.redirect("/orderList")

    } catch (error) {
        // Handle errors
        console.error("Error updating order status:", error);
        res.status(500).send("Internal Server Error");
    }
};


  
  module.exports ={
      adminLoginPage ,
      adminSubmitlogin,
      dashboard,
      adminLogout,
      orderList,
      orderDetails,
      orderStatus
  }