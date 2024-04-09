const User = require("../model/user");
const uuid = require("uuid");
const dotenv = require("dotenv");
dotenv.config();
const Razorpay = require('razorpay');


const addAddress = async (req, res) => {
  try {
    const formData = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create a new address object
    const newAddress = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      postcode: formData.postcode,
      email: formData.email,
      phone: formData.phone,
      
    };

    // Assuming user.address is an array field in the User model
    user.address.push(newAddress);
    await user.save();

    // console.log('New address saved:', newAddress);
    // console.log('Updated user:', user);

    // Redirect back to the checkout page or show a success message
    return res.redirect("/checkout");
  } catch (error) {
    console.error("Error in addAddress:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error adding address" });
  }
};

const showCheckout = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.redirect("/login-register");
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    // console.log('User:', user);
    // console.log('Address:', user.address);

    return res.render("user/checkout", { user, address: user.address });
  } catch (error) {
    console.error("Error in showCheckout:", error);
    return res.status(500).send("Internal Server Error");
  }
};



const placeOrder = async (req, res) => {
  const { paymentMethod } = req.body;
  try {
    // if (paymentMethod === "cod") {
      const userId = req.user.id;
      if (!userId) {
        return res.redirect("/login-register");
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send("User not found");
      }

      const grandtotal = user.grandtotal;


      const currentDate = new Date();
      const currentTime = currentDate.toLocaleTimeString();

      // Generate a unique orderId
      const orderId = uuid.v4(); // Generate a random UUID

      // Fetch product details from user's bookings
      const orders = [
        {
          items: user.bookings.map((item) => ({
            productName: item.productName,
            quantity: item.quantity,
          })),
          totalAmountUserPaid: grandtotal,
          date: currentDate,
          time: currentTime,
          orderId: orderId,
          status: "Pending",
          paymentMethod:paymentMethod,
        },
      ];

      // Update the orders array in the User collection
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $push: { orders: { $each: orders } } }, // Add new orders to the existing orders array
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).send("User not found");
      }

      // Clear the user's bookings after placing the order
      updatedUser.bookings = [];
      await updatedUser.save();

      return res.redirect("/checkout?success=orderSuccessfully");
    // } else {
      // Handle other payment methods
      // return res.redirect("/ERROR");
    // }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .render("error", {
        message:
          "An error occurred while placing the order. Please try again later.",
      });
  }
};



// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET
});

// Function to create Razorpay order
async function createRazorpayOrder(req, res) {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.redirect("/login-register");
    }
     
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    const grandtotal = user.grandtotal;
      const { totalAmount } = req.body;
       const total =  totalAmount + grandtotal
      const options = {
          amount:  total*100, // Amount in paise
          currency: 'INR',
          receipt: uuid.v4(),
      };

      const order = await razorpay.orders.create(options);
      res.status(200).json({ order, key_id: process.env.KEY_ID });
  } catch (error) {
      console.error('Error:', error);
      res.status(500).send('An error occurred while creating Razorpay order.');
  }
}
 



// const razorpay = new Razorpay({
//   key_id: process.env.KEY_ID,
//   key_secret: process.env.KEY_SECRET
// });


// const createRazorpayOrder = async (req, res) => {
//   try {
   
//     const { totalAmount } = req.body;
//     console.log("this is boyd", req.body);
//     const key_id = process.env.KEY_ID;
//     const options = {
//       amount: totalAmount * 100, // Amount in paise
//       currency: 'INR',
//       receipt: uuid.v4(),
//     };

//     console.log("this is options", options);
//     const order = await razorpay.orders.create(options);
//     res.status(200).json({ order, key_id }); // Wrap order and key_id in an object for proper JSON response

//     console.log("this is new Options", order);
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).send('An error occurred while creating Razorpay order.');
//   }
// };



// const saveRazorpayResponse = async (req, res) => {
//   try {
//     const { razorpayResponse, userId } = req.body;
    
//     // Extract relevant data from razorpayResponse
//     const { order_id, status } = razorpayResponse;

//     // Update the order status in the User collection
//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       { $set: { "orders.$[elem].status": status } }, // Update the status of the relevant order
//       { arrayFilters: [{ "elem.orderId": order_id }], new: true }
//     );

//     if (!updatedUser) {
//       return res.status(404).send("User not found");
//     }

//     // Clear the user's bookings after placing the order
//     updatedUser.bookings = [];
//     await updatedUser.save();

//     return res.redirect("/checkout?success=orderSuccessfully");
//     // Handle other updates as per your requirement

//     // res.status(200).send("Razorpay response saved successfully");
//   } catch (error) {
//     console.error('Error while saving Razorpay response:', error);
//     res.status(500).send('An error occurred while saving Razorpay response.');
//   }
// }


 


module.exports = {
  showCheckout,
  addAddress,
  placeOrder,
  createRazorpayOrder,
  // saveRazorpayResponse
  
};
