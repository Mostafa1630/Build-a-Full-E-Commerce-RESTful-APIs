const express = require("express");

const router = express.Router();
const controller = require("../controllers/brand.controller");
const valitator = require("../utils/validators/brandValidator");

router
  .route("/")
  .get(controller.getBrands)
  .post(
    controller.uploadCategoryImage,
    controller.resizeImage,
    valitator.createBrandValidator,
    controller.createBrand
  );

router
  .route("/:id")
  .get(valitator.getBrandValidator, controller.getBrand)
  .put(
    controller.uploadCategoryImage,
    controller.resizeImage,
    valitator.updateBrandValidator,
    controller.updateBrand
  )
  .delete(valitator.deleteBrandValidator, controller.deleteBrand);

module.exports = router;
