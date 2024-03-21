const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
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
        // default: 70
    }
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
