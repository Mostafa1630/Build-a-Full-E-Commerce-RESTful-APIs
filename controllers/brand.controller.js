const sharp = require("sharp");
const AsyncHandler = require("express-async-handler");

const factory = require("./handlersFactory");
const Brand = require("../models/brand.model");
const { uploadSingleImage } = require("../middleware/uploadImageMiddleware");

exports.uploadCategoryImage = uploadSingleImage("image");

exports.resizeImage = AsyncHandler(async (req, res, next) => {
  const ext = req.file.mimetype.split("/")[1];
  const filename = `brand${Date.now()}.${ext}`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/brands/${filename}`);

  // save image into our db
  req.body.image = filename;
  next();
});

// @desc    Get list of brands
// @route   GET /api/v1/brands
// @access  Public
exports.getBrands = factory.getAll(Brand);

// @desc    Get specific brand by id
// @route   GET /api/v1/brands/:id
// @access  Public
exports.getBrand = factory.getOne(Brand);

// @desc    Create brand
// @route   POST  /api/v1/brands
// @access  Private
exports.createBrand = factory.createOne(Brand);

// @desc    Update specific brand
// @route   PUT /api/v1/brands/:id
// @access  Private
exports.updateBrand = factory.updateOne(Brand);

// @desc    Delete specific brand
// @route   DELETE /api/v1/brands/:id
// @access  Private
exports.deleteBrand = factory.deleteOne(Brand);
