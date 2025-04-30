const Review=require('../model/review')
const Listing=require('../model/listings')

module.exports.index=async (req, res, next) => {
  // console.log(req.body.review)
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    let listData = await Listing.findById(req.params.id);
    await newReview.save();
    listData.reviews.push(newReview);
    await listData.save();
    req.flash("success", "New Review Created !");
    res.redirect(`/listings/${req.params.id}`);
  }

module.exports.delete=async (req, res, next) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted !");
    res.redirect(`/listings/${id}`);
  }