const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");

//protected
exports.addAddress = asyncHandler(async (req, res, next) => {
  // $addToSet ==> add productId to wislist arrry if not exist
  const user = User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: req.body },
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "Address added successfuly",
    data: user.addresses,
  });
});

exports.removeAddress = asyncHandler(async (req, res, next) => {
  // $pull ==> remove productId from wislist arrry if exist
  const user = User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { addresses: {_id:req.params.addressId} },
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "Address removed",
    data: user.addresses,
  });
});

exports.getLoggedUserAddresses = asyncHandler(async (req,res,next) => {
  const user = User.finById(req.user._id).populate('addresses');
  res.status(200).json({
    status: "success",
    result:user.addresses.length,
    data: user.addresses,
  });
})
