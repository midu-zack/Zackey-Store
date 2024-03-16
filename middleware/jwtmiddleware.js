const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const verifyToken = (req,res,next)=>{

    const token = req.cookies.jwt


    try{
        
        if(!token){
           
            return res.render("user/login-register")
        } 
        const decoded = jwt.verify(token,process.env.JWT_KEY);

        req.user = decoded;
        
        next();
    }

    catch(error){

        return res.render('user/login-register')

    }
}
 
module.exports = verifyToken;