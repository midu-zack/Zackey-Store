const express = require("express");
const path = require('path')
const dotenv = require("dotenv")
dotenv.config()
 
const userRouter = require("./routers/user");
const authRoutes = require("./routers/auth")
// const adminRouter = require("./routers/admin");
const bodyParser = require("body-parser");
const connectDatabase = require("./config/database");
// const { session } = require("passport");
const session = require("express-session")

const app = express();

const port = 2005;

app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(session({
  secret:"your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production if using HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    } 
}))


app.use("/", authRoutes);
app.use("/", userRouter);




app.listen(port,async() => {
  console.log(`server running on  ${port}`);
  await connectDatabase() 
});
