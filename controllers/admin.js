const Admin = require("../model/admin");
const User = require("../model/user");
const Product = require("../model/product");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Orders = require("../model/orders");
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
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 9); // Subtract 9 days instead of 10

    // const allStatuses = ["pending", "shipped", "delivered", "cancelled"];

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
    ordersCount = JSON.stringify(ordersCount);

    const lineChart = await Orders.aggregate([
      // Match documents within the last 10 days
      {
        $match: {
          createdAt: { $gte: tenDaysAgo },
        },
      },
      // Group by date and payment method
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            paymentMethod: "$payment.method",
          },
          totalSales: { $sum: "$total" },
        },
      },
      // Group again to merge the data for each date
      {
        $group: {
          _id: "$_id.date",
          sales: {
            $push: {
              paymentMethod: "$_id.paymentMethod",
              totalSales: "$totalSales",
            },
          },
        },
      },
      // Project to calculate total revenue
      {
        $project: {
          date: "$_id",
          sales: {
            $reduce: {
              input: "$sales",
              initialValue: 0,
              in: {
                $add: ["$$value", "$$this.totalSales"],
              },
            },
          },
        },
      },
    ]);
    let lineChartLabels = lineChart.map((item) => item.date);
    let lineChartData = lineChart.map((item) => item.sales);

    res.locals.labels = lineChartLabels;
    res.locals.data = lineChartData;
    
    console.log(lineChartLabels, lineChartData);

    lineChartLabels = JSON.stringify(lineChartLabels);
    lineChartData = JSON.stringify(lineChartData);
    console.log(lineChartLabels, lineChartData);
    const totalProduct = await Product.countDocuments();

    // Total sales amount
    const totalSalesData = await Orders.aggregate([
      {
        $match: {
          "products.date": { $gte: tenDaysAgo },
          "products.status": { $ne: "cancelled" },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$products.amount" },
        },
      },
    ]);

    const totalSalesAmount =
      totalSalesData.length > 0 ? totalSalesData[0].totalAmount : 0;

    // Payment method counts
    const paymentMethodCounts = await Orders.aggregate([
      {
        $unwind: "$payment",
      },
      {
        $group: {
          _id: "$payment.method",
          count: { $sum: 1 },
        },
      },
    ]);

    const cashOnDeliveryCount =
      paymentMethodCounts.find((method) => method._id === "cod")?.count || 0;
    const onlinePaymentCount =
      paymentMethodCounts.find((method) => method._id === "online")?.count || 0;

    // Prepare data for rendering
    const labels = ["Delivered", "Pending", "Shipped", "Cancelled"];
    const data = [
      // totalNumberOfDeliveredOrders,
      // totalNumberOfPendingOrders,
      // totalNumberOfShippedOrders,
      // totalNumberOfCancelledOrders,
    ];

    // Pass data to the view
    res.render("admin/dashboard", {
      // orders,
      ordersCount, // for pie chart
      lineChartData, // for line chart
      lineChartLabels,

      totalProduct,
      totalSalesAmount,
      cashOnDeliveryCount,
      onlinePaymentCount,
    });
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
