const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const verifyToken = (req,res,next)=>{

    const token = req.cookies.jwt

    if(!token){
        return res.render('user/login')
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_KEY);
        req.user = decoded;
        next();

    }catch(error){
        return res.render('user/login')
    }
}


module.exports = verifyToken;