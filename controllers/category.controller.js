const factory = require('./handlersFactory');
const Category = require('../models/category.model');
const sharp = require('sharp');
const AsyncHandler = require('express-async-handler');
const {uploadSingleImage} = require('../middleware/uploadImageMiddleware');


exports.uploadCategoryImage = uploadSingleImage("image");

exports.resizeImage = AsyncHandler(async(req, res,next) => {
  const ext = req.file.mimetype.split('/')[1];
  const filename = `category${Date.now()}.${ext}`; 
  await sharp(req.file.buffer)
  .resize(600, 600)
  .toFormat('jpeg')
  .jpeg({quality: 90})
  .toFile(`uploads/categories/${filename}`);

  // save image into our db
  req.body.image = filename; 
  next();
});






// @desc    Get list of categories
// @route   GET /api/v1/categories
// @access  Public

// Build query
exports.getCategories = factory.getAll(Category);

// @desc    Get specific category by id
// @route   GET /api/v1/categories/:id
// @access  Public
exports.getCategory = factory.getOne(Category);

// @desc    Create category
// @route   POST  /api/v1/categories
// @access  Private
exports.createCategory = factory.createOne(Category);

// @desc    Update specific category
// @route   PUT /api/v1/categories/:id
// @access  Private
exports.updateCategory = factory.updateOne(Category);

// @desc    Delete specific category
// @route   DELETE /api/v1/categories/:id
// @access  Private
exports.deleteCategory = factory.deleteOne(Category);