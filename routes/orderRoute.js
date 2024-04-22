const express = require("express");

const router = express.Router();
const {
  createCashOrder,
  findAllOrders,
  findSpecificOrder,
  fillterObjForLoggedUser,
  updateOrderToPaid,
  updateOrderToDelivered,
  checkSession,
} = require("../controllers/orderServices");
const authService = require("../controllers/authService");

router.use(authService.protect);
router
  .route("/checkout-session/:cartId")
  .get(authService.allowedTo("user"), checkSession);

router.route("/:cartId").post(authService.allowedTo("user"), createCashOrder);
router
  .route("/")
  .get(
    authService.allowedTo("user", "admin", "manger"),
    fillterObjForLoggedUser,
    findAllOrders
  );
router.route("/:id").get(authService.allowedTo("user"), findSpecificOrder);
router
  .route("/:id/pay")
  .put(authService.allowedTo("admin", "manger"), updateOrderToPaid);
router
  .route("/:id/deliver")
  .put(authService.allowedTo("admin", "manger"), updateOrderToDelivered);

module.exports = router;
