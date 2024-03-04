// auth related
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const User = require("../model/user");
const generateOTP = require("../utils/otpGenerator");
const dotenv = require("dotenv")
dotenv.config()
 
// get  loginPage
const loginPage = (req, res) => {
  try {
    res.render("user/login-register");
  } catch (err) {
    console.error("Error rendering login page:", err);
    res.status(500).send("Internal Server Error");
  }
};

const otpReg = (req, res) => {
  try {
    res.render("user/otp-register");
  } catch (err) {
    console.error("Error rendering otp register", err);
    res.status(500).send("Internal Server Error");
  }
};

// handle login submission
const submitLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // if (user.block){
    //   return res.render('login',{message:'user contact blocked'})
    // }

    if (!user) {
      return res
        .status(404)
        .render("user/login-register", {
          message: "User not exist. Please Register.",
        });
    }
    //password hashing
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res
        .status(404)
        .render("user/login-register", {
          message: "Incorrect password. Please try again.",
        });
    }

    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Login failed", error });
  }
};



// LOGIN With Google
const  successGoogleLogin = async(req,res)=>{
  try{
    if(!req.user){
      return res.status(404).send('no user data , Login field')
    }
    console.log(rq.user);

    const user = await User.findOne({email:req.user.email});
    
    if(!user){

      user = new User ({
        name : req.user.displayName,
        email: req.user.email,
      })
      await  user.save();
    }
   
    res.status(200).redirect('/')

  }catch(error){
    console.error("Error logging in with Google:", error);
    res.status(500).redirect("/login");
    
  }
}

const failureGooglelogin = (req, res) => {
  res.status(500).send("Error logging in with Google");
};


// Function to create a transporter for sending emails
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.APP_EMAIL , // Your Gmail email address
    pass: process.env.APP_PASSWORD // Your Gmail password or application-specific password
  },
  
});


// Function to generate OTP (One Time Password)

// Function to send OTP via email
const sendOTP = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: "miduzack3007@gmail.com",
      to: email,
      subject: "OTP for email verification",
      text: `Your OTP is: ${otp}`,
    });

    console.log("OTP sent successfully to:", email);

    console.log(otp);
  } catch (error) {
    console.error("Error sending OTP:", error);
  }
};

// handle signup form submission
let submitRegister = async (req, res) => {
  try {
    const { email } = req.body;
    const userExist = await User.exists({ email: email.toLowerCase() });

    if (userExist) {
      return res
        .status(400)
        .json({
          success: false,
          message: "email already exist, Please try again",
        });
    }

    const password = req.body.password;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const otp = generateOTP();

    const newUser = new User({
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      password: hashedPassword,
      otp,
       
    });

    console.log(newUser);

    await newUser.save();
    sendOTP(req.body.email, otp);
   
    
    console.log(email);

    // res.redirect('/otp-register');
    res.render("user/otp-register",{email:email});

  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "Internal server Error", error });
  }
};

const verifyOTP = async (req, res) => {

  const email = req.body.email;

  console.log('This proper mail',email);

  const otp = req.body.otp;
  //  console.log("frnt otp ",otp);
  try {
    const user = await User.findOne({email});

    console.log("backend otp ",user);

    console.log("check the user",user);

    if (!user || user.otp !== otp || user.otpExpiration < Date.now()) {
      res.status(400).render("user/otp-register", { error: "Invalid OTP" });
    } else {
      // res.send('OTP verified successfully');
      res.render("user/index");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error in verifyOpt");
  }
};

module.exports = {
  loginPage,
  submitRegister,
  submitLogin,
  sendOTP,
  verifyOTP,
  otpReg,
  successGoogleLogin,
  failureGooglelogin
};
