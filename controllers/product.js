const Product = require("../model/product");

// show the product list page
let listProduct = (req, res) => {
  try {
    res.render("admin/product-list");
  } catch (error) {
    console.log(error);
  }
};

// show the product add page
let addProduct = (req, res) => {
  try {
    res.render("admin/product-add");
  } catch (error) {
    console.log(error);
  }
};

let productAdding = async (req, res) => {
  try {
    const {
      productName,
      mrp,
      price,
      color,
      coupon,
      createdAt,
      meterial,
      description,
    } = req.body;
    console.log(req.body);
 

 
    const newProduct = new Product({
      name: productName,
      material: meterial,
      mrp: mrp,
      price: price,
      color: color,
      createdAt: createdAt,
      coupon: coupon,
      description: description,
    });

    await newProduct.save();
    const product = await Product.find();
  
    res.render("admin/product-list", { product });
  } catch (error) {
    console.error("Error saving Product:", error);
    res
      .status(500)
      .json({ message: "An error occurred while saving the Product" });
  }
};

module.exports = {
  listProduct,
  addProduct,
  productAdding,
};
