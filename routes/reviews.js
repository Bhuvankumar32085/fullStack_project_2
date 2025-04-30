const express = require("express");
const router = express.Router({ mergeParams: true });
const { reviewSchema } = require("../schema.js");
const ExpressError = require("../error.js");
const { isLoggedIn, isReviewAuther } = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.message;
    throw new ExpressError(401, errMsg);
  } else {
    next();
  }
};

function asyncWrap(fun) {
  return function (req, res, next) {
    fun(req, res, next).catch((err) => next(err));
  };
}

//reviews
router.post("/", isLoggedIn, validateReview, asyncWrap(reviewController.index));

//delete reviews
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuther,
  asyncWrap(reviewController.delete)
);

module.exports = router;
