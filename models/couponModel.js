const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "coupon name required"],
      unique: true,
      uppercase:true,
    },
    expire: {
      type: Date,
      required: [true, "expired to end coupon required"],
    },
    discount: {
      type: Number,
      required: [true, "discount to this coupon required"],
    },
  },
  { timestamps: true }
);

module.exports = new mongoose.model("Coupon", couponSchema);
