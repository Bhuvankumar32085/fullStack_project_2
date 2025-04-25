const express = require("express");
const router = express.Router();
const { listingSchema } = require("../schema.js");
const ExpressError = require("../error.js");
const Listing = require("../model/listings.js");
const { isLoggedIn, isOwner } = require("../middleware.js");

//controllers
const listingController = require("../controllers/listing.js");

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.message;
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

function asyncWrap(fun) {
  return function (req, res, next) {
    fun(req, res, next).catch((err) => next(err));
  };
}

//index rout
router.get("/", asyncWrap(listingController.index));

//new rout
router.get("/create", isLoggedIn, listingController.renderNewForm);

//show rout
router.get("/:id", asyncWrap(listingController.showRout));

//create
router.post("/", validateListing, asyncWrap(listingController.created));

//edit
router.get("/:id/edit", isLoggedIn, isOwner, asyncWrap(listingController.edit));

// update
router.put("/:id", isLoggedIn, isOwner, asyncWrap(listingController.update));

// delete
router.delete("/:id", isLoggedIn, isOwner, asyncWrap(listingController.delete));

module.exports = router;
