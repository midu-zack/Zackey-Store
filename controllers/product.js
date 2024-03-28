const Product = require("../model/product");
const Category = require("../model/categorie");
const cloudinary = require("../config/cloudinary");
// const tinycolor = require("tinycolor2");

// show the product list page
let listProduct = async (req, res) => {
  try {
    const products = await Product.find();
    res.render("admin/product-list",{products});
  } catch (error) {
     console.error(error);
    res.status(500).json({ message: "An error occurred while fetching products" });
  }
};
// show the product add page
let ShowAddProduct = async (req, res) => {
  try {
    
    const categories = await Category.find();
    res.render("admin/product-add",{categories});
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "An error occurred while fetching categories" });
  }
};
 

// Function to convert hexadecimal color code to color name
// function convertHexToColorName(hexColor) {
//   try {
//       hexColor = hexColor.replace('#', '');
//       console.log("Processed hexColor:", hexColor);
//       const color = tinycolor(`#${hexColor}`);
//       console.log("Tinycolor object:", color);
//       const colorName = color.toName();
//       console.log("Color name:", colorName);
//       return colorName ? colorName : `#${hexColor.toUpperCase()}`; // Return original color code if color name is not found
//   } catch (error) {
//       console.error("Error converting color:", error);
//       return `#${hexColor.toUpperCase()}`; // Return original color code on error
//   }
// }


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
            modelNumber,
        } = req.body;

        console.log("Received color:",color);

        const imageURLs = [];

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            imageURLs.push(result.secure_url);
        } else {
            return res.send("No product images found");
        }

        // const convertedColor = convertHexToColorName(color);

        // console.log("Converted color:", convertedColor);

        const newProduct = new Product({
            name: productName,
            meterial: meterial,
            mrp: mrp,
            price: price,
            color: color,
            createdAt: createdAt,
            category: category,
            coupon: coupon,
            description: description,
            modelNumber: modelNumber,
            images: imageURLs,

        });

        await newProduct.save();

        console.log('Product saved successfully');

        res.redirect("/listProduct");
    } catch (error) {
        console.error("Error saving Product:", error);
        res.status(500).json({ message: "An error occurred while saving the Product" });
    }
};





let editProduct = async (req, res) => {
  try {

    let productId = req.params.id;


    let product = await Product.findById(productId);

    if (!product) {
      return res.status(404).send("Product not found");
    }

    const categories = await Category.find();

    if (!categories) {
      return res.status(404).send("categories not found");
    }
    res.render("admin/product-edit",{product,categories}); // Pass the product object to the template

  } catch (error) {
    res.status(500).send("Internal Server Error in product Edit");
  }
};





const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    console.log("update productId:", productId);
   
    const {
      productName,
      mrp,
      price,
      coupon,
      category,
      material,
      description,
    } = req.body;

    console.log("this is req body:", req.body);

    let updateFields = {
      name: productName,
      mrp: mrp,
      price: price,
      coupon: coupon,
      category: category,
      material: material, 
      description: description,
    };

    // Check if there's a file to upload
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      updateFields.images = [result.secure_url];
    }

    console.log('this is file',req.file);

    // Update the product using findByIdAndUpdate
    const updatedProduct = await Product.findByIdAndUpdate(productId, updateFields, { new: true });

    if (!updatedProduct) {
      return res.status(404).send("Product not found");
    }

    console.log("Updated product:", updatedProduct);

    res.redirect("/listProduct");
  } catch (error) {
    console.error("Error updating Product:", error);
    res.status(500).send("Internal Server Error in product Update");
  }
};
 

let deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id; // Assuming product ID is passed in the URL parameters
    
    // Find the product by ID and delete it
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).redirect("/listProduct");
  } catch (error) {
    console.error("Error deleting Product:", error);
    res.status(500).json({ message: "An error occurred while deleting the Product" });
  }
};
 

const singleProductDetails =async (req,res)=>{
  try {
    const productId = req.params.id
    const product = await Product.findById(productId)
     
    

    res.render("user/product-details",{product})
  } catch (error) {
     console.error(error);
  }
}

module.exports = {
  listProduct,
  ShowAddProduct,
  productAdding,
  editProduct,
  updateProduct,
  deleteProduct,
  singleProductDetails
};
