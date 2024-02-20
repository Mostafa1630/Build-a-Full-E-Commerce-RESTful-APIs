const express = require("express");

const router = express.Router();
const controller = require("../controllers/cartServices");
const authService = require("../controllers/authService");

router.use(authService.protect, authService.allowedTo("user"));
router
  .route("/")
  .get(controller.getLoggedUserCart)
  .post(controller.addProductCart)
  .delete(controller.clearLoggedUser);

router
  .route("/:itemId")
  .put(controller.updateCartItemQuantity)
  .delete(controller.deleteProductFormCart);

router.route("/applycoupon").put(controller.applyCoupon);

module.exports = router;
