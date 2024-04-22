const stripe = require("stripe")(process.env.STRIPE_SECRET);
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const factory = require("./handlersFactory");
const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");

exports.createCashOrder = asyncHandler(async (req, res, next) => {
  // 1- Get cartItems depned on cartId
  // 2- Get OrderPrice using totalPrice in cartItems and If coupon Return TotalPriceAfterDiscount
  // 3- Create order with paymentMethodType default = cash
  // 4- update in product decrement quantity and increment sold
  // 5- clear cartItems

  // ## create operation
  // 1- Get cartItems depned on cartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(
      new ApiError(`Not found CartItems for this id ${req.params.cartId}`, 404)
    );
  }

  // 2- Get OrderPrice using totalPrice in cartItems and If coupon Return TotalPriceAfterDiscount
  const taxPrice = 0; //from admin calc price of tax
  const shippingPrice = 0; //from admin calc price of shipping
  const cartPrice = cart.totalCartPriceAfterDiscount
    ? cart.totalCartPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  // 3- Create order with paymentMethodType default = cash
  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAdress: req.body.shippingAdress,
    totalOrderPrice,
  });

  // 4- update in product decrement quantity and increment sold
  if (order) {
    const bulkOptions = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOptions, {});
  }

  // 5- clear cartItems
  await Cart.findByIdAndDelete(req.params.cartId);

  res.status(201).json({ status: "success", data: order });
});

// get orders for loggged user
exports.fillterObjForLoggedUser = asyncHandler((req, res, next) => {
  if (req.user.role === "user") {
    req.filterObj = { user: req.user._id };
  }
  next();
});

exports.findAllOrders = factory.getAll(Order);

exports.findSpecificOrder = factory.getOne(Order);

// Update order Paid status to isPaid  using Admin
// api/v1/orders/:id/pay  <==== Route
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new ApiError(`Not Found Order for this id ${req.params.id}`, 404)
    );
  }
  order.isPaid = true;
  order.paidAt = Date.now();
  const updatedOrder = await order.save();
  res.status(200).json({ status: "success", data: updatedOrder });
});

// Update order delivered status to isdelivered  using Admin
// api/v1/orders/:id/deliver  <==== Route
exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new ApiError(`Not Found Order for this id ${req.params.id}`, 404)
    );
  }
  order.isDelivered = true;
  order.deliveredAt = Date.now();
  const updatedOrder = await order.save();
  res.status(200).json({ status: "success", data: updatedOrder });
});

// GET api/v1/checkout-session/cartId

exports.checkSession = asyncHandler(async (req, res, next) => {
  // 1- Get cartItems depned on cartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(
      new ApiError(`Not found CartItems for this id ${req.params.cartId}`, 404)
    );
  }

  // 2- Get OrderPrice using totalPrice in cartItems and If coupon Return TotalPriceAfterDiscount
  const taxPrice = 0; //from admin calc price of tax
  const shippingPrice = 0; //from admin calc price of shipping

  const cartPrice = cart.totalCartPriceAfterDiscount
    ? cart.totalCartPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  // 3- create stripe checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        name: req.user.name,
        amount: totalOrderPrice * 100, //stripe return 2 00 after .
        currency: "egp",
        quantity: 1,
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        // price: "{{PRICE_ID}}",
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/cart`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: req.body.shippingAdress,
  });

  // send session to response
  res.status(200).json({ status: "success", session });
});

// create order by data in session

const createCardOrder = async (session) => {
  const cartId = session.client_reference_id;
  const shippingAdress = session.metadata;
  const orderPrice = session.amount_total / 100;

  const cart = await Cart.findById(cartId);
  const user = User.findOne({ email: session.customer_email });

  // create order
  // 3- Create order with paymentMethodType default = cash
  const order = await Order.create({
    user: user._id,
    cartItems: cart.cartItems,
    shippingAdress,
    totalOrderPrice: orderPrice,
    isPaid: true,
    paidAt: Date.now(),
    paymentMethodType: card,
  });

  // 4- update in product decrement quantity and increment sold
  if (order) {
    const bulkOptions = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOptions, {});
  }

  // 5- clear cartItems
  await Cart.findByIdAndDelete(cartId);
};

exports.webHookCheckout = asyncHandler(async (req, res, next) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === "checkout.session.completed") {
    // console.log(event); //content all data in session
    createCardOrder(event.data.object);
  }

  res.status(200).json({ recevied: true });
});
