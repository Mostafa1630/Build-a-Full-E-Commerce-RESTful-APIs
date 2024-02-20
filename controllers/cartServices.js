const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const Coupon = require("../models/couponModel");

// calculate total price
const calcPrice = (arr) => {
  let totalPrice = 0;
  arr.cartItems.forEach((item) => {
    totalPrice += item.price * item.quantity;
  });
  return totalPrice;
};

exports.addProductCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;
  const product = await Product.findById(productId);
  //Get Carts For Logged User
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    // Create A new Product In Cart
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [{ product: productId, color, price: product.price }],
    });
  } else {
    // if product and same color already exits to update quntity only
    const productIndex = cart.cartItems.findIndex((item) => {
      item.product.toString() === productId && item.color === color;
    });
    // if productExit is true
    if (productIndex > -1) {
      const newCartItems = cart.cartItems[productIndex];
      newCartItems.quantity += 1;
      cart.cartItems[productIndex] = newCartItems;
    } else {
      // if productExit is false not exit
      // push cartItem to carts
      cart.cartItems.push({ product: productId, color, price: product.price });
    }
  }
  // calculate total price
  const totalPrice = calcPrice(cart);

  cart.totalCartPrice = totalPrice;
  cart.totalCartPriceAfterDiscount = undefined;
  await Cart.save();

  res.status(200).json({
    status: "success",
    numberOfCarts: cart.cartItems.length,
    message: "Product added to cart",
    data: cart,
  });
});

exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(
      new ApiError(`There is not cart for this user ${req.user._id}`, 404)
    );
  }
  res.status(200).json({
    status: "success",
    numberOfCarts: cart.cartItems.length,
    data: cart,
  });
});

exports.deleteProductFormCart = asyncHandler(async (req, res, next) => {
  const cart = Cart.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { cartItems: { _id: req.params.itemId } },
    },
    { new: true }
  );

  // calculate total price
  const totalPrice = calcPrice(cart);

  cart.totalCartPrice = totalPrice;
  cart.totalCartPriceAfterDiscount = undefined;
  await Cart.save();

  res.status(200).json({
    status: "success",
    numberOfCarts: cart.cartItems.length,
    data: cart,
  });
});

exports.clearLoggedUser = asyncHandler(async (req, res, next) => {
  await Cart.findByIdAndDelete(req.user._id);
  res.status(204).send();
});

exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(
      new ApiError(`There is not cart for this user ${req.user._id}`, 404)
    );
  }
  const itemIndex = cart.cartItems.findIndex(
    (item) => req.params.itemId === item._id.toString()
  );
  if (itemIndex > -1) {
    let cartItem = cart.cartItems[itemIndex];
    cartItem.quantity = quantity;
    cart.cartItems[itemIndex] = cartItem;
  } else {
    return next(
      new ApiError(`There is not item for this id ${req.user._id}`, 404)
    );
  }

  // calculate total price
  const totalPrice = calcPrice(cart);

  cart.totalCartPrice = totalPrice;
  cart.totalCartPriceAfterDiscount = undefined;
  await Cart.save();

  res.status(200).json({
    status: "success",
    numberOfCarts: cart.cartItems.length,
    message: "Quantity Product update for this cart",
    data: cart,
  });
});

exports.applyCoupon = asyncHandler(async (req, res, next) => {
  // Get Coupon Based name
  const { coupon } = req.body;
  const couponFind = await Coupon.findOne({
    name: coupon,
    expire: { $gt: Date.now() },
  });

  if (!couponFind) {
    return next(
      new ApiError(`There is not coupon for this name or not expired`, 404)
    );
  }
  // Get logged Cart For this user to update
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(
      new ApiError(`There is not cart for this user ${req.user._id}`, 404)
    );
  }
  // calculate total price
  const totalPrice = cart.totalCartPricel;

  const calcTalPrice = (
    totalPrice -
    (totalPrice * couponFind.discount) / 100
  ).toFixed(2);
  cart.totalCartPriceAfterDiscount = calcTalPrice;

  await Cart.save();

  res.status(200).json({
    status: "success",
    numberOfCarts: cart.cartItems.length,
    data: cart,
  });
});
