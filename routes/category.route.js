const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const controller = require("../controllers/category.controller");
const valitator = require("../utils/validators/categoryValidator");
const subcategoriesRoute = require("./subCategory.route");

router.use("/:categoryId/subcategories", subcategoriesRoute);

router
  .route("/")
  .get(controller.getCategories)
  .post(
    controller.uploadCategoryImage,
    controller.resizeImage,
    valitator.createCategoryValidator,
    controller.createCategory
  );

router
  .route("/:id")
  .get(valitator.getCategoryValidator, controller.getCategory)
  .put(
    controller.uploadCategoryImage,
    controller.resizeImage,
    valitator.updateCategoryValidator,
    controller.updateCategory
  )
  .delete(valitator.deleteCategoryValidator, controller.deleteCategory);

module.exports = router;
