const express = require("express");
const path = require('path')
const dotenv = require("dotenv")
dotenv.config()
 
const userRouter = require("./routers/user");
const authRoutes = require("./routers/auth")
const adminRouter = require("./routers/adminRouter");
const bodyParser = require("body-parser");
const connectDatabase = require("./config/database");

const app = express();

const port = 2005;

app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use("/", authRoutes);
app.use("/", userRouter);



app.listen(port,async() => {
  console.log(`server running on  ${port}`);
  await connectDatabase() 
});
