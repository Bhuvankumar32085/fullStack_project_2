const express = require("express");
const router = express.Router({ mergeParams: true });
const { reviewSchema } = require("../schema.js");
const ExpressError = require("../error.js");
const Listing = require("../model/listings.js");
const Review = require("../model/review.js");
const { isLoggedIn, isReviewAuther } = require("../middleware.js");

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
router.post(
  "/",
  isLoggedIn,
  validateReview,
  asyncWrap(async (req, res, next) => {
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    let listData = await Listing.findById(req.params.id);
    await newReview.save();
    listData.reviews.push(newReview);
    await listData.save();
    req.flash("success", "New Review Created !");
    res.redirect(`/listings/${req.params.id}`);
  })
);

//delete reviews
router.delete(
  "/:reviewId",isLoggedIn,isReviewAuther,
  asyncWrap(async (req, res, next) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted !");
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
