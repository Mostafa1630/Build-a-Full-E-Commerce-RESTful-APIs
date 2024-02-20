const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

//protected
exports.addProductToWishlist = asyncHandler(async (req, res, next) => {
  // $addToSet ==> add productId to wislist arrry if not exist
  const user = User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishlist: req.body.productId },
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "Producted added successfuly to wishlist",
    data: user.wishlist,
  });
});

exports.removeProductFormWishlist = asyncHandler(async (req, res, next) => {
  // $pull ==> remove productId from wislist arrry if exist
  const user = User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishlist: req.params.productId },
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "Producted removed from wishlist",
    data: user.wishlist,
  });
});

exports.getLoggedUserWishlist = asyncHandler(async (req,res,next) => {
  const user = User.finById(req.user._id).populate('wishlist');
  res.status(200).json({
    status: "success",
    result:user.wishlist.length,
    data: user.wishlist,
  });
})
