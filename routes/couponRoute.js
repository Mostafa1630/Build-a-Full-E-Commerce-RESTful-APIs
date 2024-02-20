const express = require("express");

const router = express.Router();
const controller = require("../controllers/couponServices");
const authService = require("../controllers/authService");

router.use(authService.protect, authService.allowedTo("manager", "admin"));

router.route("/").get(controller.getCoupons).post(controller.createCoupon);

router
  .route("/:id")
  .get(controller.getCoupon)
  .put(controller.updateCoupon)
  .delete(controller.deleteCoupon);

module.exports = router;
