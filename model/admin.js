const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  coupons: [
    {
      couponCode: { type: String },
      couponLimit: { type: Number },
      createdAt: { type: Date },
      endDate: { type: Date },
      discountAmount: { type: Number },
    },
  ],
});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin; // export the module
