const Admin = require("../model/admin");
const User = require("../model/user");
const Product = require("../model/product");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Orders = require("../model/orders");
const { Coupon } = require("../model/admin");

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

// const dashboard = async (req, res) => {
//   try {
//     const tenDaysAgo = new Date();
//     tenDaysAgo.setDate(tenDaysAgo.getDate() - 9); // Subtract 9 days instead of 10

//     const salesData = await User.aggregate([
//       {
//         $unwind: "$orders",
//       },
//       {
//         $match: {
//           "orders.date": { $gte: tenDaysAgo },
//         },
//       },
//       {
//         $addFields: {
//           formattedDate: {
//             $dateToString: { format: "%Y-%m-%d", date: "$orders.date" },
//           },
//         },
//       },
//       {
//         $group: {
//           _id: "$formattedDate",
//           totalAmount: { $sum: "$orders.totalAmountUserPaid" },
//         },
//       },
//       {
//         $sort: { _id: 1 },
//       },
//     ]);

//     const labels = JSON.stringify(salesData.map((entry) => entry._id));
//     const data = JSON.stringify(salesData.map((entry) => entry.totalAmount));

//     // Pass stringified labels and data to the view
//     res.locals.labels = labels;
//     res.locals.data = data;

//     // Total delivery orders
//     const totalDeliveredOrders = await User.aggregate([
//       {
//         $unwind: "$orders", // Unwind the orders array
//       },
//       {
//         $match: {
//           "orders.date": { $gte: tenDaysAgo },
//           "orders.status": "Delivered", // Filter for delivered orders
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           count: { $sum: 1 }, // Count the number of delivered orders
//         },
//       },
//     ]);

//     // Extract the count of delivered orders
//     const totalNumberOfDeliveredOrders =
//       totalDeliveredOrders.length > 0 ? totalDeliveredOrders[0].count : 0;

//     // Total orders
//     const totalOrders = await User.aggregate([
//       {
//         $unwind: "$orders", // Unwind the orders array
//       },
//       {
//         $match: {
//           "orders.date": { $gte: tenDaysAgo },
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           count: { $sum: 1 }, // Count the number of orders
//         },
//       },
//     ]);

//     // Extract the count of orders
//     const totalNumberOfOrders =
//       totalOrders.length > 0 ? totalOrders[0].count : 0;

//     // Delivery-pending
//     const pendingOrders = await User.aggregate([
//       {
//         $unwind: "$orders", // Unwind the orders array
//       },
//       {
//         $match: {
//           "orders.date": { $gte: tenDaysAgo },
//           "orders.status": "Pending", // Filter for orders with status "Pending"
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           count: { $sum: 1 }, // Count the number of pending orders
//         },
//       },
//     ]);

//     // Extract the count of pending orders
//     const pendingOrdersCount =
//       pendingOrders.length > 0 ? pendingOrders[0].count : 0;

//     //  Total shipped
//     const shippedOrders = await User.aggregate([
//       {
//         $unwind: "$orders", // Unwind the orders array
//       },
//       {
//         $match: {
//           "orders.date": { $gte: tenDaysAgo },
//           "orders.status": "Shipped", // Filter for orders with status "Shipped"
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           count: { $sum: 1 }, // Count the number of shipped orders
//         },
//       },
//     ]);

//     // Extract the count of shipped orders
//     const shippedOrdersCount =
//       shippedOrders.length > 0 ? shippedOrders[0].count : 0;

//     //   Total of Product
//     const totalProduct = await Product.countDocuments();

//     // Total cancellation
//     const cancelledOrders = await User.aggregate([
//       {
//         $unwind: "$orders", // Unwind the orders array
//       },
//       {
//         $match: {
//           "orders.date": { $gte: tenDaysAgo },
//           "orders.status": "Cancelled", // Filter for orders with status "Cancelled"
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           count: { $sum: 1 }, // Count the number of cancelled orders
//         },
//       },
//     ]);

//     // Extract the count of cancelled orders
//     const cancelledOrdersCount =
//       cancelledOrders.length > 0 ? cancelledOrders[0].count : 0;

//     // Total Siles
//     const totalSalesData = await User.aggregate([
//       {
//         $unwind: "$orders", // Unwind the orders array
//       },
//       {
//         $match: {
//           "orders.date": { $gte: tenDaysAgo },
//           "orders.status": { $ne: "Cancelled" }, // Exclude cancelled orders
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           totalAmount: { $sum: "$orders.totalAmountUserPaid" }, // Sum of totalAmountUserPaid
//         },
//       },
//     ]);

//     // Extract the total sales amount
//     const totalSalesAmount =
//       totalSalesData.length > 0 ? totalSalesData[0].totalAmount : 0;

//       const paymentMethodCounts = await User.aggregate([
//         {
//           $unwind: "$orders"
//         },
//         {
//           $group: {
//             _id: "$orders.paymentMethod",
//             count: { $sum: 1 }
//           }
//         }
//       ]);

//       const cashOnDeliveryCount = paymentMethodCounts.find(method => method._id === "cod")?.count || 0;
//       const razorpayCount = paymentMethodCounts.find(method => method._id === "razorpay")?.count || 0;

//       // Data for the pie chart
//       const chartData = {
//         labels: ['cod', 'Razorpay'],
//         datasets: [{
//           label: 'Payment Method Distribution',
//           data: [cashOnDeliveryCount, razorpayCount], // Update this line
//           backgroundColor: [
//             'rgb(255, 99, 132)',
//             'rgb(54, 162, 235)',
//           ],
//         }]
//       };

//       const chartDataJSON = JSON.stringify(chartData);

//     // Pass stringified labels and data to the template
//     res.render("admin/dashboard", {
//       labels,
//       data,
//       totalNumberOfDeliveredOrders,
//       totalNumberOfOrders,
//       pendingOrdersCount,
//       shippedOrdersCount,
//       totalProduct,
//       cancelledOrdersCount,
//       totalSalesAmount,
//       chartDataJSON
//     });
//   } catch (error) {
//     console.error("Error fetching sales data:", error);
//     res.status(500).send("Internal Server Error");
//   }
// };

const dashboard = async (req, res) => {
  try {
    res.render("admin/dashboard");
  } catch (error) {
    console.error("Error fetching data:", error);
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

// const orderList = async (req, res) => {
//   try {
//     const usersAndOrders = await Orders.find({
//       orders: { $exists: true, $ne: [] },
//     });

//     res.render("admin/order-list", { usersAndOrders });
//   } catch (error) {
//     console.error(error);
//   }
// };

const orderList = async (req, res) => {
  try {
    const ordersWithProducts = await Orders.find({
      products: { $exists: true, $not: { $size: 0 } },
    }).populate({
      path: "orderedBy",
      select: "name", // Specify the fields you want to select from the referenced document
    });

    // console.log(ordersWithProducts);

    res.render("admin/order-list", { ordersWithProducts });
  } catch (error) {
    console.error(error);
    // Handle the error appropriately, maybe send an error response
    res.status(500).send("Internal Server Error");
  }
};

const orderDetails = async (req, res) => {
  try {
    // const orderId = req.params.id;
    // console.log("this is the orderId", orderId);

    const orderId = req.query.orderId;
    console.log(orderId);

    // Find the user with the specific order and retrieve only the matching order

    const order = await Orders.findById(orderId).populate(
      "products.product",
      "name"
    );

    // console.log("this is order " , order);
    if (!order) {
      return res.status(404).json({ error: "order not fount in user's," });
    }

    console.log("thsi is tezt ", order);
    res.json(order);

    // const userAndOneOrder = await User.aggregate([
    //   { $match: { "orders.orderId": orderId } },
    //   { $unwind: "$orders" },
    //   { $match: { "orders.orderId": orderId } },
    // ]);

    // if (userAndOneOrder.length === 0) {
    //   // Handle case where user (and hence order) is not found
    //   return res.status(404).send("Order not found");
    // }

    // Pass the order details to the view

    // res.render("admin/order-details", { userAndOneOrder });
  } catch (error) {
    // Handle errors
    console.error("Error fetching order details:", error);
    res.status(500).send("Internal Server Error");
  }
};

// orderStatus

// const orderStatus = async (req, res) => {
//   try {
//     const { statusValue, orderID } = req.body;

//     // console.log("this is status value", statusValue,"then you have id ", orderID);

//     // Find the user and update the status of the matching order
//     const updatedUser = await Orders.findOneAndUpdate(
//       { "orders.orderId": orderID },
//       { $set: { "orders.$.status": statusValue } },
//       { new: true }
//     );

//     // console.log("this is updausers",updatedUser);
//     if (!updatedUser) {
//       // Handle case where user or order is not found
//       return res.status(404).send("User or Order not found");
//     }

//     // Redirect or render success page
//     // res.render("admin/order-list");
//     res.redirect("/orderList");
//   } catch (error) {
//     // Handle errors
//     console.error("Error updating order status:", error);
//     res.status(500).send("Internal Server Error");
//   }
// };

const orderStatus = async (req, res) => {
  try {
    const statusUpdates = req.body;

    // Use Promise.all to update statuses of all products in parallel
    const promises = statusUpdates.map(async (update) => {
      const { productId, statusValue } = update;
      return await Orders.findOneAndUpdate(
        { "products._id": productId },
        { $set: { "products.$.status": statusValue } },
        { new: true }
      );
    });

    // Wait for all updates to complete
    const updatedOrders = await Promise.all(promises);

    if (!updatedOrders.every((order) => order)) {
      return res.status(404).send("Order not found");
    }

    res.send("Order statuses updated successfully");
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).send("Internal Server Error");
  }
};

const dashboardData = async (req, res) => {
  try {
    // const tenDaysAgo = new Date();
    // tenDaysAgo.setDate(tenDaysAgo.getDate() - 9); // Subtract 9 days instead of 10

    // const lineChart = await Orders.aggregate([
    //   // Match documents within the last 10 days
    //   {
    //     $match: {
    //       createdAt: { $gte: tenDaysAgo },
    //     },
    //   },
    //   // Group by date and payment method
    //   {
    //     $group: {
    //       _id: {
    //         date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
    //         paymentMethod: "$payment.method",
    //       },
    //       totalSales: { $sum: "$total" },
    //     },
    //   },
    //   // Group again to merge the data for each date
    //   {
    //     $group: {
    //       _id: "$_id.date",
    //       sales: {
    //         $push: {
    //           paymentMethod: "$_id.paymentMethod",
    //           totalSales: "$totalSales",
    //         },
    //       },
    //     },
    //   },
    //   // Project to calculate total revenue
    //   {
    //     $project: {
    //       date: "$_id",
    //       sales: {
    //         $reduce: {
    //           input: "$sales",
    //           initialValue: 0,
    //           in: {
    //             $add: ["$$value", "$$this.totalSales"],
    //           },
    //         },
    //       },
    //     },
    //   },
    // ]);

    // const lineChartLabels = lineChart.map((item) => item.date);
    // const lineChartData = lineChart.map((item) => item.sales);

    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 9); // Subtract 9 days instead of 10

    // Fetch sales data for the last 10 days
    const lineChart = await Orders.aggregate([
      // Match documents within the last 10 days
      {
        $match: {
          createdAt: { $gte: tenDaysAgo },
        },
      },
      // Group by date to calculate total sales for each day
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalSales: { $sum: "$total" },
        },
      },
      // Sort the data by date in ascending order
      {
        $sort: { _id: 1 },
      },
    ]);

    // Extract labels (dates) and data (revenue)
    const lineChartLabels = lineChart.map((item) => item._id);
    const lineChartData = lineChart.map((item) => item.totalSales);

    /// round Chart
    const ordersCountByStatus = await Orders.aggregate([
      {
        $unwind: "$products",
      },
      {
        $group: {
          _id: "$products.status",
          count: { $sum: 1 },
        },
      },
      {
        $facet: {
          counts: [
            {
              $project: {
                status: "$_id",
                count: 1,
                _id: 0,
              },
            },
          ],
        },
      },
    ]);

    // Convert the result to an object for easier manipulation
    const countsObj = {};
    ordersCountByStatus[0].counts.forEach((status) => {
      countsObj[status.status] = status.count;
    });
    let ordersCount = {
      pending: countsObj?.pending || 0,
      delivered: countsObj?.delivered || 0,
      cancelled: countsObj?.cancelled || 0,
      shipped: countsObj?.shipped || 0,
    };

    const paymentGraphData = await Orders.aggregate([
      {
        $match: {
          "products.status": "delivered",
        },
      },
      {
        $group: {
          _id: "$payment.method",
          totalRevenue: { $sum: "$total" },
        },
      },
      // Restructure the data to separate COD and Online payments
      {
        $project: {
          _id: 0,
          paymentMethod: "$_id",
          totalRevenue: 1,
        },
      },
    ]);

    const totalOrders = await Orders.countDocuments();

    const totalProducts = await Product.countDocuments();

    // console.log("this is paymentGreapgh data", paymentGraphData);

    const totalRevenue = paymentGraphData.reduce(
      (acc, cur) => acc + cur.totalRevenue,
      0
    );
    console.log("Total Revenue:", totalRevenue);

    return res.json({
      // lineChartLabels,
      // lineChartData,
      lineChartLabels,
      lineChartData,
      ordersCount,
      paymentGraphData,
      totalOrders,
      totalProducts,
      totalRevenue,
    });
  } catch (error) {
    console.error("Error in dashboardData:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// coupon list
const couponsList = async (req, res) => {
  try {
    res.render("admin/coupons-list");
  } catch (error) {}
};

const addCoupon = async (req, res) => {
  try {
    res.render("admin/coupon-add");
  } catch (error) {}
};

const addCouponController = async (req, res) => {
  try {
    console.log("this is req.body", req.body);

    // Extract data from the request body
    const { couponCode, couponLimit, startDate, endDate, discountAmount } =
      req.body;

    // Find the admin document by its ID
    const admin = await Admin.findOne();

    // If admin is not found, return an error
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const newCoupon = {
      couponCode,
      couponLimit,
      createdAt: startDate, // Assuming createdAt should be set to the current date
      endDate,
      discountAmount, // Assuming discountAmount should be initialized to 0
    };
    console.log("this is admin", admin);
    // Add the new coupon to the coupons array
    admin.coupons.push(newCoupon);

    // Save the updated admin document
    const coupons = await admin.save();

    // Return the updated admin document as JSON response
    res.status(201).render("admin/coupons-list", coupons);
  } catch (error) {
    console.error("Error adding coupon:", error);
    res.status(500).json({ message: "Server error" });
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
  dashboardData,
  couponsList,
  addCoupon,
  addCouponController,
  //   getSalesData
};
