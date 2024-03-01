const User = require("../model/user")
const bcrypt = require("bcrypt");


// get homepage
let homePage = (req, res) => {
  try {
    res.render('user/index');
  } catch (error) {
    console.error(error ,"rendering homage  ");
    res.status(500).send('Internal Server Error');
  }
}


// get  loginPage
const loginPage = (req, res) => {
  try {
    res.render('user/login-register');
  } catch (err) {
    console.error('Error rendering login page:', err);
    res.status(500).send('Internal Server Error');
  }
};



// handle login submission
 let submitLogin = async (req, res) => {
 
  try {
    const {email,password} = req.body
     
    //finding the name
    const name = req.body.name;

    const user = await User.findOne({ email });
 
    // if (user.block){
    //   return res.render('login',{message:'user contact blocked'})
    // }

    if (!user) {
      return res.status(404).render('user/login-register',{ message: 'User not exist. Please Register.' });
    }
    //password hashing
    const passwordMatch = await bcrypt.compare(password, user.password);
 
    if (!passwordMatch) {
    
      return res.status(404).render('user/login-register',{ message: 'Incorrect password. Please try again.' });
      
    }

    res.redirect('/');
  
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error });
  }
};



// handle signup form submission
 let submitRegister = async (req, res) => {
  
  try {
    
    const password = req.body.Password
  
      const hashedPassword = await bcrypt.hash(password,10)
      
      const newUser = new User ({
        name : req.body.Name,
        phoneNumber : req.body.PhoneNumber,
        email : req.body.Email,
        password : hashedPassword
      })

      console.log(newUser);
    

    await newUser.save();
    

    res.redirect('/login-register');

  } catch (error) {

    console.error(error);

    res.status(500).json({ message: 'Internal server Error', error });

  }
};

 
module.exports ={
    homePage,
    loginPage,
    submitRegister,
    submitLogin,
   
}