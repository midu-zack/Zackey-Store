const express = require("express");
const mongoose = require("mongoose");
const path = require('path')

const userRouter = require("./routers/userRouter");
const adminRouter = require("./routers/adminRouter");

const app = express();

const port = 2005;

app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


mongoose
  .connect("mongodb://localhost:27017/E-commerce-database", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });


app.use("/", userRouter);


app.listen(port, () => {
  console.log(`server running on  ${port}`);
});
