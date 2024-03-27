const User = require("../model/user");
const uuid = require("uuid")
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
            phone: formData.phone
        };

        // Assuming user.address is an array field in the User model
        user.address.push(newAddress);
        await user.save();

        // console.log('New address saved:', newAddress);
        // console.log('Updated user:', user);

        // Redirect back to the checkout page or show a success message
        return res.redirect("/checkout");

    } catch (error) {
        console.error('Error in addAddress:', error);
        return res.status(500).json({ success: false, message: 'Error adding address' });
    }
}

const showCheckout = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!userId) {
            return res.redirect('/login-register');
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send('User not found');
        }

        // console.log('User:', user);
        // console.log('Address:', user.address);

        return res.render("user/checkout", { user, address: user.address });
    } catch (error) {
        console.error('Error in showCheckout:', error);
        return res.status(500).send('Internal Server Error');
    }
};


    const placeOrder = async (req,res)=>{

            const {paymentMethod} = req.body
    try {
        if (paymentMethod === 'cod') {
            const userId = req.user.id;
            if (!userId) {
                return res.redirect('/login-register');
            }

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).send('User not found');
            }

            console.log("this is trueeee" , user);
            const grandtotal = user.grandtotal;

            const currentDate = new Date();
            const currentTime = currentDate.toLocaleTimeString();

            // Generate a unique orderId
            const orderId = uuid.v4(); // Generate a random UUID


            // Fetch product details from user's bookings
            const orders = [{
                items: user.bookings.map(item => ({
                    productName: item.productName,
                    quantity: item.quantity
                   
                })),
                totalAmountUserPaid: grandtotal,
                date: currentDate,
                time: currentTime,
                orderId:orderId,
                status:'Pending'
            }];

            // console.log(orders);
            // Update the orders array in the User collection
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { $push: { orders: { $each: orders } } }, // Add new orders to the existing orders array
                { new: true }
            );

            if (!updatedUser) {
                return res.status(404).send('User not found');
            }

            // Clear the user's bookings after placing the order
            updatedUser.bookings = [];
            await updatedUser.save();

            return res.redirect('/?success=orderSuccessfully');
        } else {
            // Handle other payment methods
            return res.redirect('/ERROR');
        }
        } catch (error) {
            console.log(error);
        }
    }

module.exports = {
    showCheckout,
    addAddress,
    placeOrder
};
