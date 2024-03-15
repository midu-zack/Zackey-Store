 
const Admin = require("../model/admin")
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

  let adminLogout = (req, res) => {
    try {
        // Assuming you're using session-based authentication
        req.session.destroy((err) => {
            if (err) {
                console.error("Error destroying session:", err);
                res.status(500).json({ message: "Failed to logout" });
            } else {
                res.status(200).render('admin/dashboard',{ message: "Logout successful" });
            }
        });
    } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({ message: "Failed to logout" });
    }
}



// handle login submission
let adminSubmitlogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });

        console.log(email);

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
  
  module.exports ={
      adminLoginPage ,
      adminSubmitlogin,
      adminLogout
  }