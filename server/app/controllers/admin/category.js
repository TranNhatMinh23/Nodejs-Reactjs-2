// const User = require("../../models/users");
const moment = require("moment");
// const passwordHash = require("password-hash");
const Category = require("../../models/categories");

// create category
viewCreateCategory = async (req, res) => {
  let _data = {
    titlePage: "New Category",
    notification: {}
  };
  return res.render("admin/category/create", _data);
};

createCategory = async (req, res) => {
  try {
    let data = req.body;

    data.is_active && (data.is_active = data.is_active == "on" ? true : false );

    const category = new Category(data);
    await category.save();

    let result = {
      titlePage: "New Category",
      notification: {
        status: "success",
        msg: "Successfully added!",
        action: "create-category"
      }
    }

    return res.render("admin/category/create", result);
  } catch (err) {
    let result = {
      titlePage: "New Category",
      notification: {
        status: "error",
        msg: "Created Error!",
        action: "create-category"
      }
    }

    return res.render("admin/category/create", result);
  }
};

// update category
viewCategory = async (req, res) => {
  const id = req.params.id;

  const category = await Category.findById(id).exec();

  let _data = {
    titlePage: category.name,
    category,
    notification: {}
  };
  return res.render("admin/category/detail", _data);
};

updateCategory = async (req, res) => {
  try {
    const _id = req.params.id;
    const data = req.body;
    data.is_active && (data.is_active = data.is_active == "on" ? true : false );
    
    let category = await Category.findOneAndUpdate(
      { _id },
      { $set: data },
      (err, response) => {
        if (err) throw err;
        // console.log(response);
      }
    ).exec();

    let result = {
      category,
      titlePage: category.name,
      notification: {
        status: "success",
        msg: "Successfully updated",
        action: "update-category"
      }
    };

    return res.render("admin/category/detail", result);
  } catch (err) {
    console.log(err);
    let result = {
      category: {},
      titlePage: "Detail",
      notification: {
        status: "error",
        msg: "Updated Error!",
        action: "update-category"
      }
    };

    return res.render("admin/category/detail", result);
  }
};

// delete category
deleteCategory = async (req, res) => {
  const { id } = req.params;
  let category = await Category.deleteOne({ _id: id }).exec();

  return res.redirect("/admin/categories");
};

// delete multi reocords
deleteRecordsCategory = async (req, res) => {
  try {
    let data = req.body;
    let list_del = data._arr;
    list_del.map(async val => {
      let category = await Category.deleteOne(
        { _id: val },
        (err, response) => {
          if(err) throw err;
          // console.log(response)
        }
      );
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(400).json({ success: false });
  }
};

// all categories
viewAllCategories = async (req, res) => {
  let _data = {
    titlePage: "Categories",
    moment
  };

  const categories = await Category.find()
    .sort("-updatedAt")
    .exec();

  _data.categories = categories;

  return res.render("admin/category/index", _data);
};

module.exports = {
  viewAllCategories,
  viewCreateCategory,
  createCategory,
  viewCategory,
  updateCategory,
  deleteCategory,
  deleteRecordsCategory,
};
