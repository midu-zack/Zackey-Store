const Product = require("../model/product");
const Category= require("../model/categorie")

// show the product list page
let listProduct = (req, res) => {
  try {
    res.render("admin/product-list");
  } catch (error) {
    console.log(error);
  }
};

let addProduct = async (req, res) => {
  try {
    const categories = await Category.find(); // Fetch categories from your database
    res.render("admin/product-add", { categories });  
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
      category,
      meterial,
      description,
    } = req.body;
    console.log(req.body);
 
console.log(req.body.category);
 
    const newProduct = new Product({
      name: productName,
      material: meterial,
      mrp: mrp,
      price: price,
      color: color,
      createdAt: createdAt,
      category:category,
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
