const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { 
     type: String,
   //   required: true, 
    
    },

   //  createdAt: {
   //    type: Date,
   //    default: () => {
   //        const now = new Date();
   //        // Extract the date part
   //        const dateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
   //        return dateOnly;
   //    }
   //    },

   phoneNumber :{
      type:String,
      
   },

   otp: {
      type : String,
   },
   isVerified:{
      type: Boolean,default:false
   } ,
 
   otpExpiration:{
      type: Date
   } ,


  email: { 
     type: String,
   //   required: true ,
     unique: true
   },

  password: {
     type: String,
     
   },
});

 
const User = mongoose.model('User', userSchema);

module.exports = User; // export the module