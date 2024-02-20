const express = require("express");

const router = express.Router({ mergeParams: true });
const controller = require("../controllers/review.controller");
const valitator = require("../utils/validators/reviewValidator");
const authService = require("../controllers/authService");

router
  .route("/")
  .get(controller.createFilterObj, controller.getReviews)
  .post(
    authService.protect,
    authService.allowedTo("user"),
    controller.setProductIdAndUserIdToBody,
    valitator.createReviewValidator,
    controller.createReview
  );

router
  .route("/:id")
  .get(valitator.getReviewValidator, controller.getReview)
  .put(
    authService.protect,
    authService.allowedTo("user"),
    valitator.updateReviewValidator,
    controller.updateReview
  )
  .delete(
    authService.protect,
    authService.allowedTo("user", "manager", "admin"),
    valitator.deleteReviewValidator,
    controller.deleteReview
  );

module.exports = router;
