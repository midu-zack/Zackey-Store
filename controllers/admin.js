 
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
                // Password incorrect
                res.render('admin/admin-login', { error: 'Incorrect email or password' });
            }
        } else {
            // Admin not found
            res.render('admin/admin-login', { error: 'Admin not found' });
        }
    } catch (error) {
        
        console.error(error);
        res.render('admin/admin-login', { error: 'An error occurred' });
    }
};
  
  module.exports ={
      adminLoginPage ,
      adminSubmitlogin
  }