const Categorie = require("../model/categorie");

let categorieListShow = async (req, res) => {
  try {
    const category = await Categorie.find();
    res.render("admin/categorie-list", { category });
  } catch (error) {
    console.error(error, "rendering login page ");
    res.status(500).send("Internal Server Error in home page");
  }
};

let categorieAddShow = (req, res) => {
  try {
    res.render("admin/categories-add");
  } catch (error) {
    console.error(error, "rendering login page ");
    res.status(500).send("Internal Server Error in home page");
  }
};

const submitAddCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const newCategorie = new Categorie({
      categorie: name,
    });
    await newCategorie.save();
    const category = await Categorie.find();
    res.status(201).render("admin/categorie-list", { category });
  } catch (error) {
    console.error("Error saving Categorie:", error);
    res
      .status(500)
      .json({ message: "An error occurred while saving the Categorie" });
  }
};

let categoryEdit = async (req, res) => {
  try {
    let categoryId = req.params.id;

    console.log("categoryId", categoryId);

    let category = await Categorie.findById(categoryId);

    if (!category) {
      return res.status(404).send("Category not found");
    }

    // let categorieName = category.categorie;

    res.render("admin/categories-edit", { category });
  } catch (error) {
    res.status(500).send("Internal Server Error in category Edit");
  }
};

let categoryUpdate = async (req, res) => {
  try {
    let categoryId = req.params.id;

    console.log(categoryId);

    let category = await Categorie.findById(categoryId);

    if (!category) {
      return res.status(404).send("Category not found");
    }

    category.categorie = req.body.categorie;

    return res.status(200).redirect("/categorie");
  } catch (error) {
    console.error("Error updating category:", error);
    return res.status(500).send("Internal Server Error in category Update");
  }
};

let categoryDelete = async (req, res) => {
  try {
    let categoryId = req.params.id;
    console.log("categoryId from delete ", categoryId);

    // findByAndDelete
    let category = await Categorie.findByIdAndDelete(categoryId);

    if (!category) {
      return res.status(404).send({ message: "Category not found" });
    }

    return res.status(200).redirect("/categorie");
  } catch (error) {
    console.error("Error deleting category:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  categorieListShow,
  categorieAddShow,
  submitAddCategory,
  categoryEdit,
  categoryUpdate,
  categoryDelete
};
