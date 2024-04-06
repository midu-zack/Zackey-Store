const Admin = require("../model/admin");
const User = require("../model/user");
const Product = require("../model/product");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// ADMIN LOGIN PAGE SHOW
const adminLoginPage = (req, res) => {
  try {
    res.render("admin/admin-login");
  } catch (error) {
    console.error(error, "rendering login page ");
    res.status(500).send("Internal Server Error in home page");
  }
};

// const dashboard = (req,res)=>{
//     try {
//         res.render("admin/dashboard")
//     } catch (error) {

//     }
// }

// const dashboard = async (req, res) => {
//     try {
//         const tenDaysAgo = new Date();
//         tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

//         console.log("thsi is datea", tenDaysAgo);
//         const orderDate = await User.aggregate([
//             {
//                 $unwind: "$orders" // Unwind the orders array
//             },
//             {
//                 $project: {
//                     _id: 0,
//                     orderDate: "$orders.date" // Include only the orders.date field
//                 }
//             }
//         ]);
//         // console.log("this is ", orderDate);

//         // Iterate through each document in the array and convert the orderDate to ISODate format
//         const isoDateStrings = orderDate.map(doc => {
//             const dateObject = new Date(doc.orderDate);
//             return dateObject.toISOString();
//         });

//         console.log("this is changed ", isoDateStrings);

//         const salesData = await User.aggregate([
//             {
//                 $match: {
//                     "orderDate": { $gte: tenDaysAgo }
//                 }
//             },
//             {
//                 $addFields: {
//                     formattedDate: {
//                         $dateToString: { format: "%Y-%m-%d", date: "$orders.date" }
//                     }
//                 }
//             },
//             {
//                 $group: {
//                     _id: "$formattedDate",
//                     totalAmount: { $sum: "$orders.totalAmountUserPaid" }
//                 }
//             },
//             {
//                 $sort: { _id: 1 }
//             }
//         ]);

//         console.log("editd" , salesData);

//         const labels = salesData.map(entry => entry._id);
//         const data = salesData.map(entry => entry.totalAmount);

//         res.render("admin/dashboard", { labels, data });
//     } catch (error) {
//         console.error("Error fetching sales data:", error);
//         res.status(500).send("Internal Server Error");
//     }
// }

// const dashboard = async (req, res) => {
//     try {
//         const tenDaysAgo = new Date();
//         tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

//         console.log("this is date", tenDaysAgo);

//         const salesData = await User.aggregate([
//             {
//                 $unwind: "$orders" // Unwind the orders array
//             },
//             {
//                 $match: {
//                     "orders.date": { $gte: tenDaysAgo }
//                 }
//             },
//             {
//                 $addFields: {
//                     formattedDate: {
//                         $dateToString: { format: "%Y-%m-%d", date: "$orders.date" }
//                     }
//                 }
//             },
//             {
//                 $group: {
//                     _id: "$formattedDate",
//                     totalAmount: { $sum: "$orders.totalAmountUserPaid" }
//                 }
//             },
//             {
//                 $sort: { _id: 1 }
//             }
//         ]);

//         console.log("edited", salesData);

//         // Stringify labels and data
//         const labels = JSON.stringify(salesData.map(entry => entry._id));
//         const data = JSON.stringify(salesData.map(entry => entry.totalAmount));

//         // Pass stringified labels and data to the template
//         res.render("admin/dashboard", { labels, data });
//     } catch (error) {
//         console.error("Error fetching sales data:", error);
//         res.status(500).send("Internal Server Error");
//     }
// }

const dashboard = async (req, res) => {
  try {
    // const currentDate = new Date();
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

    // console.log("this is date", tenDaysAgo);

    const salesData = await User.aggregate([
      {
        $unwind: "$orders", // Unwind the orders array
      },
      {
        $match: {
          "orders.date": { $gte: tenDaysAgo },
        },
      },
      {
        $addFields: {
          formattedDate: {
            $dateToString: { format: "%Y-%m-%d", date: "$orders.date" },
          },
        },
      },
      {
        $group: {
          _id: "$formattedDate",
          totalAmount: { $sum: "$orders.totalAmountUserPaid" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Stringify labels and data
    const labels = JSON.stringify(salesData.map((entry) => entry._id));
    const data = JSON.stringify(salesData.map((entry) => entry.totalAmount));

    // console.log(data);
    // console.log(labels);

    // Pass stringified labels and data to the view
    res.locals.labels = labels;
    res.locals.data = data;

    // Total customers
    const totalUsers = await User.aggregate([
        {
            $match: {
                lastLogin: { $gte: tenDaysAgo } // Match users who have logged in within the last 10 days
            }
        },
        {
            $group: {
                _id: "$_id", // Group by the unique user ID
            }
        },
        {
            $group: {
                _id: null,
                count: { $sum: 1 } // Count the number of unique users
            }
        }
    ]);
    
    // Now `totalUsers` contains an array with a single object, which holds the count of unique users who have logged in
    const totalNumberOfUsers = totalUsers.length > 0 ? totalUsers[0].count : 0;
    
    console.log("Total number of login users:", totalNumberOfUsers);
    

    // Total delivery orders
    const totalDeliveredOrders = await User.aggregate([
      {
        $unwind: "$orders", // Unwind the orders array
      },
      {
        $match: {
          "orders.date": { $gte: tenDaysAgo },
          "orders.status": "Delivered", // Filter for delivered orders
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 }, // Count the number of delivered orders
        },
      },
    ]);

    // Extract the count of delivered orders
    const totalNumberOfDeliveredOrders =
      totalDeliveredOrders.length > 0 ? totalDeliveredOrders[0].count : 0;

    // Total orders
    const totalOrders = await User.aggregate([
      {
        $unwind: "$orders", // Unwind the orders array
      },
      {
        $match: {
          "orders.date": { $gte: tenDaysAgo },
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 }, // Count the number of orders
        },
      },
    ]);

    // Extract the count of orders
    const totalNumberOfOrders =
      totalOrders.length > 0 ? totalOrders[0].count : 0;

    // Delivery-pending
    const pendingOrders = await User.aggregate([
      {
        $unwind: "$orders", // Unwind the orders array
      },
      {
        $match: {
          "orders.date": { $gte: tenDaysAgo },
          "orders.status": "Pending", // Filter for orders with status "Pending"
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 }, // Count the number of pending orders
        },
      },
    ]);

    // Extract the count of pending orders
    const pendingOrdersCount =
      pendingOrders.length > 0 ? pendingOrders[0].count : 0;

    //  Total shipped
    const shippedOrders = await User.aggregate([
      {
        $unwind: "$orders", // Unwind the orders array
      },
      {
        $match: {
          "orders.date": { $gte: tenDaysAgo },
          "orders.status": "Shipped", // Filter for orders with status "Shipped"
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 }, // Count the number of shipped orders
        },
      },
    ]);

    // Extract the count of shipped orders
    const shippedOrdersCount =
      shippedOrders.length > 0 ? shippedOrders[0].count : 0;

    //   Total of Product
    const totalProduct = await Product.countDocuments();

    // Total cancellation
    const cancelledOrders = await User.aggregate([
      {
        $unwind: "$orders", // Unwind the orders array
      },
      {
        $match: {
          "orders.date": { $gte: tenDaysAgo },
          "orders.status": "Cancelled", // Filter for orders with status "Cancelled"
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 }, // Count the number of cancelled orders
        },
      },
    ]);

    // Extract the count of cancelled orders
    const cancelledOrdersCount =
      cancelledOrders.length > 0 ? cancelledOrders[0].count : 0;

    // Total Siles
    const totalSalesData = await User.aggregate([
      {
        $unwind: "$orders", // Unwind the orders array
      },
      {
        $match: {
          "orders.date": { $gte: tenDaysAgo },
          "orders.status": { $ne: "Cancelled" }, // Exclude cancelled orders
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$orders.totalAmountUserPaid" }, // Sum of totalAmountUserPaid
        },
      },
    ]);

    // Extract the total sales amount
    const totalSalesAmount =
      totalSalesData.length > 0 ? totalSalesData[0].totalAmount : 0;

    // Pass stringified labels and data to the template
    res.render("admin/dashboard", {
      labels,
      data,
      totalNumberOfUsers,
      totalNumberOfDeliveredOrders,
      totalNumberOfOrders,
      pendingOrdersCount,
      shippedOrdersCount,
      totalProduct,
      cancelledOrdersCount,
      totalSalesAmount,
    });
  } catch (error) {
    console.error("Error fetching sales data:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Get the current date

// Calculate the start date of the current period (10 days ago)
//  const startDate = new Date(currentDate);
//  startDate.setDate(startDate.getDate() - 10);

//  // Calculate the end date of the current period
//  const endDate = new Date(currentDate);

//  console.log("Start Date:", startDate);
//  console.log("End Date:", endDate);

// Fetch sales data for the current period
//  const salesData = await User.aggregate([
//      {
//          $unwind: "$orders"
//      },
//      {
//          $match: {
//              "orders.date": { $gte: startDate, $lte: endDate }
//          }
//      },
//      {
//          $addFields: {
//              formattedDate: {
//                  $dateToString: { format: "%Y-%m-%d", date: "$orders.date" }
//              }
//          }
//      },
//      {
//          $group: {
//              _id: "$formattedDate",
//              totalAmount: { $sum: "$orders.totalAmountUserPaid" }
//          }
//      },
//      {
//          $sort: { _id: 1 }
//      }
//  ]);

const adminLogout = (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).send("Internal Server Error");
      }
      res.redirect("/admin");
    });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).send("Internal Server Error");
  }
};

// handle login submission
let adminSubmitlogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    // console.log(email);

    if (admin) {
      if (password === admin.password) {
        // Generate JWT token
        const token = jwt.sign(
          {
            id: admin._id,
            email: admin.email,
          },
          process.env.JWT_KEY,
          {
            expiresIn: "24h",
          }
        );

        // Set JWT Token in a cookie
        res.cookie("jwt", token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
          // secure: process.env.NODE_ENV === "production"
        });

        res.redirect("/dashboard");
      } else {
        res.render("admin/admin-login", {
          error: "Incorrect email or password",
        });
      }
    } else {
      res.render("admin/admin-login", { error: "Admin not found" });
    }
  } catch (error) {
    console.error(error);
    res.render("admin/admin-login", { error: "An error occurred" });
  }
};

const orderList = async (req, res) => {
  try {
    const usersAndOrders = await User.find({
      orders: { $exists: true, $ne: [] },
    });

    res.render("admin/order-list", { usersAndOrders });
  } catch (error) {
    console.error(error);
  }
};

const orderDetails = async (req, res) => {
  try {
    const orderId = req.params.id;
    // console.log("this is the orderId", orderId);

    // Find the user with the specific order and retrieve only the matching order
    const userAndOneOrder = await User.aggregate([
      { $match: { "orders.orderId": orderId } },
      { $unwind: "$orders" },
      { $match: { "orders.orderId": orderId } },
    ]);

    if (userAndOneOrder.length === 0) {
      // Handle case where user (and hence order) is not found
      return res.status(404).send("Order not found");
    }

    // console.log("this is my user find the ", userAndOneOrder);

    // Pass the order details to the view

    res.render("admin/order-details", { userAndOneOrder });
  } catch (error) {
    // Handle errors
    console.error("Error fetching order details:", error);
    res.status(500).send("Internal Server Error");
  }
};

// orderStatus
const orderStatus = async (req, res) => {
  try {
    const { statusValue, orderID } = req.body;

    // console.log("this is status value", statusValue,"then you have id ", orderID);

    // Find the user and update the status of the matching order
    const updatedUser = await User.findOneAndUpdate(
      { "orders.orderId": orderID },
      { $set: { "orders.$.status": statusValue } },
      { new: true }
    );

    // console.log("this is updausers",updatedUser);
    if (!updatedUser) {
      // Handle case where user or order is not found
      return res.status(404).send("User or Order not found");
    }

    // Redirect or render success page
    // res.render("admin/order-list");
    res.redirect("/orderList");
  } catch (error) {
    // Handle errors
    console.error("Error updating order status:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  adminLoginPage,
  adminSubmitlogin,
  dashboard,
  adminLogout,
  orderList,
  orderDetails,
  orderStatus,
  //   getSalesData
};
