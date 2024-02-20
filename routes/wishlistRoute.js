const express = require("express");

const {
  addProductToWishlist,
  removeProductFormWishlist,
  getLoggedUserWishlist,
} = require("../controllers/wishlishtService");

const authService = require("../controllers/authService");

const router = express.Router();
router.use(authService.protect, authService.allowedTo("user"));

router.route("/").post(addProductToWishlist).get(getLoggedUserWishlist);

router.route("/:productId").delete(removeProductFormWishlist);

module.exports = router;