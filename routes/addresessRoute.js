const express = require("express");

const {
  addAddress,
  removeAddress,
  getLoggedUserAddresses,
} = require("../controllers/addressServices");

const authService = require("../controllers/authService");

const router = express.Router();

router.use(authService.protect, authService.allowedTo("user"));

router.route("/").post(addAddress).get(getLoggedUserAddresses);

router.route("/:addressId").delete(removeAddress);

module.exports = router;