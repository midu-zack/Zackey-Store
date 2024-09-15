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
// const { session } = require("passport");
const session = require("express-session");
const cookieParser = require('cookie-parser');


 

const app = express();
app.use(cookieParser());
 
const port = 2328;

 



// Register a custom helper function for JSON.stringify
const handlebars = exphbs.create({
  helpers: {
    stringify: function (context) {
      return JSON.stringify(context);
    },
  },
});

// Configure Handlebars
app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");

app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production if using HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    },
  })
);

app.use("/", authRoutes);
app.use("/", userRouter);
app.use("/", adminRouter);
app.use("/", categorieRouter);
app.use("/", productRouter);
app.use("/", customersRouter);
app.use("/", cartRouter);
app.use("/", wishlistRouter);
app.use("/", checkoutRouter);

app.listen(port, async () => {
  console.log(`server running on  ${port}`);
  await connectDatabase();
});
