// const exphbs = require("express-handlebars");
// const express = require("express");
// const path = require("path");
// const dotenv = require("dotenv");
// dotenv.config();

// const userRouter = require("./routers/user");
// const authRoutes = require("./routers/auth");
// const adminRouter = require("./routers/admin");
// const categorieRouter = require("./routers/categerie");
// const productRouter = require("./routers/product");
// const customersRouter = require("./routers/customers");
// const cartRouter = require("./routers/cart");
// const wishlistRouter = require("./routers/wishlist");
// const checkoutRouter = require("./routers/checkout");

// const bodyParser = require("body-parser");
// const connectDatabase = require("./config/database");
// // const { session } = require("passport");
// const session = require("express-session");
// const cookieParser = require('cookie-parser');


// // cors
// const cors =require("cors")
// const corsConfig = {
//   orgin :"*",
//   credential:"true",
//   methods:["GET","POST","PUT","DELETE"]
// }
 
// const app = express();

// app.use(cors())
// app.use(cors(corsConfig))
// const port = 2328;

// app.use(cookieParser());




// // Register a custom helper function for JSON.stringify
// const handlebars = exphbs.create({
//   helpers: {
//     stringify: function (context) {
//       return JSON.stringify(context);
//     },
//   },
// });

// // Configure Handlebars
// app.engine("handlebars", handlebars.engine);
// app.set("view engine", "handlebars");

// app.set("view engine", "hbs");
// app.use(express.static(path.join(__dirname, "public")));
// app.use(express.static(path.join(__dirname, "views")));

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use(
//   session({
//     secret: "your-secret-key",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       secure: false, // Set to true in production if using HTTPS
//       httpOnly: true,
//       maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
//     },
//   })
// );

// app.use("/", authRoutes);
// app.use("/", userRouter);
// app.use("/", adminRouter);
// app.use("/", categorieRouter);
// app.use("/", productRouter);
// app.use("/", customersRouter);
// app.use("/", cartRouter);
// app.use("/", wishlistRouter);
// app.use("/", checkoutRouter);

// app.listen(port, async () => {
//   console.log(`server running on  ${port}`);
//   await connectDatabase();
// });




const exphbs = require("express-handlebars");
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const userRouter = require("./routers/user");
const authRoutes = require("./routers/auth");
const adminRouter = require("./routers/admin");
const categorieRouter = require("./routers/categerie");
const productRouter = require("./routers/product");
const customersRouter = require("./routers/customers");
const cartRouter = require("./routers/cart");
const wishlistRouter = require("./routers/wishlist");
const checkoutRouter = require("./routers/checkout");

const bodyParser = require("body-parser");
const connectDatabase = require("./config/database");
const session = require("express-session");
const cookieParser = require('cookie-parser');
const cors = require("cors");

// CORS configuration
const corsConfig = {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"]
};

const app = express();

// Middleware setup
app.use(cors(corsConfig));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Handlebars setup
const handlebars = exphbs.create({
  helpers: {
    stringify: function (context) {
      try {
        return JSON.stringify(context);
      } catch (e) {
        console.error("Error stringifying context:", e);
        return 'Error stringifying context';
      }
    },
  },
});

app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production if using HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    },
  })
);

// Routes
app.use("/", authRoutes);
app.use("/", userRouter);
app.use("/", adminRouter);
app.use("/", categorieRouter);
app.use("/", productRouter);
app.use("/", customersRouter);
app.use("/", cartRouter);
app.use("/", wishlistRouter);
app.use("/", checkoutRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).send("Internal Server Error");
});

// Start server
const PORT = process.env.PORT || 2328;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  try {
    await connectDatabase();
  } catch (err) {
    console.error("Database connection error:", err);
  }
});

