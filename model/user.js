const mongoose = require('mongoose');
const uuid = require('uuid');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        // required: true,
    },
    phoneNumber: {
        type: String,
        // required: true,
    },
    otp: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otpExpiration: {
        type: Date
    },
    token: {
        type: String,
        default: null
    },
    blocked: {
        type: Boolean,
        default: false
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
    },
    bookings: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        
        quantity: {
            type: Number,
            default: 1
        },
        total: {
            type: Number
        },
        productName: {
            type : String
        }
    }],
    subtotal: {
        type: Number,
    },
    grandtotal: {
        type: Number,
    },
    shippingcost: {
        type: Number,
        default: 40
    },
    wishlist: [{
        items: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    }],
    address: [{
        // country: {
        //     type: String,
        
        // },
        firstName: {
            type: String,
            
        },
        lastName: {
            type: String,
             
        },
        address: {
            type: String,
            
        },
        city: {
            type: String,
            
        },
        state: {
            type: String,
          
        },
        postcode: {
            type: String,
            
        },
        email: {
            type: String,
             
        },
        phone: {
            type: String,
           
        }
    }],
    orders :[{
        items: [{
            productName: { type: String, required: true },
            quantity: { type: Number, required: true }
        }],
        totalAmountUserPaid: { type: Number, required: true },
        date: { type: String},
        time: { type: String },
        orderId: { type: String, default: uuid.v4 },
        status: { type: String, enum: ['Pending', 'Shipped', 'Delivered','Cancelled'], default: 'Pending' },
        paymentMethod: {type:String}
    }]

});

userSchema.pre('save', async function(next) {
    const bookingsPromises = this.bookings.map(async booking => {
        if (!booking.total || booking.isModified('quantity')) {
            const product = await mongoose.model('Product').findById(booking.product);
            if (product) {
                booking.total = product.price * booking.quantity;
            }
        }
    });

    await Promise.all(bookingsPromises);
    this.subtotal = this.bookings.reduce((acc, booking) => acc + booking.total, 0);
    this.grandtotal = this.subtotal + this.shippingcost;
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
