
const AsyncHandler = require("express-async-handler");

const factory = require("./handlersFactory");
const Coupon = require("../models/couponModel");

// @desc    Get list of coupon
// @route   GET /api/v1/coupons
// @access  Private Admin-Manger
exports.getCoupons = factory.getAll(Coupon);

// @desc    Get specific coupon by id
// @route   GET /api/v1/coupons/:id
// @access  Private Admin-Manger
exports.getCoupon = factory.getOne(Coupon);

// @desc    Create brand
// @route   POST  /api/v1/coupons
// @access  Private Admin-Manger
exports.createCoupon = factory.createOne(Coupon);

// @desc    Update specific coupon
// @route   PUT /api/v1/coupons/:id
// @access  Private Admin-Manger
exports.updateCoupon = factory.updateOne(Coupon);

// @desc    Delete specific coupon
// @route   DELETE /api/v1/coupons/:id
// @access  Private Admin-Manger
exports.deleteCoupon = factory.deleteOne(Coupon);
