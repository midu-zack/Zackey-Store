const mongoose = require("mongoose");

const ordersSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          min: 1,
        },
        status: {
          type: String,
          enum: ["pending", "shipped", "delivered", "cancelled"],
          default: "pending",
        },
        amount: {
          type: Number,
        },
      },
    ],
    address: {
      state: {
        type: String,
      },
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
      },
    },
    orderedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    total: {
      type: Number,
    },
    payment: {
      method: {
        type: String,
        enum: ("cod", "online"),
        required: true,
      },
      paymentId: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

const Orders = mongoose.model("Orders", ordersSchema);

module.exports = Orders; // export the module
