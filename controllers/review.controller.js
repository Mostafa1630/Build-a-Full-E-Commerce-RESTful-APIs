const AsyncHandler = require("express-async-handler");

const factory = require("./handlersFactory");
const Review = require("../models/reviewModel");


// Nested route
// GET /api/v1/products/:productId/reviews
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) filterObject = { product: req.params.productId };
  req.filterObj = filterObject;
  next();
};

// @desc    Get list of brands
// @route   GET /api/v1/brands
// @access  Public
exports.getReviews = factory.getAll(Review);

// @desc    Get specific brand by id
// @route   GET /api/v1/brands/:id
// @access  Public
exports.getReview = factory.getOne(Review,'reviews');

// Nested route (Create)
exports.setProductIdAndUserIdToBody = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

// @desc    Create brand 
// @route   POST  /api/v1/brands
// @access  Private
exports.createReview = factory.createOne(Review);

// @desc    Update specific brand
// @route   PUT /api/v1/brands/:id
// @access  Private
exports.updateReview = factory.updateOne(Review);

// @desc    Delete specific brand
// @route   DELETE /api/v1/brands/:id
// @access  Private
exports.deleteReview = factory.deleteOne(Review);
