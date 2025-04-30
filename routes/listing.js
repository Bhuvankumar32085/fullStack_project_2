const express = require("express");
const router = express.Router();
const { listingSchema } = require("../schema.js");
const ExpressError = require("../error.js");
const Listing = require("../model/listings.js");
const { isLoggedIn, isOwner } = require("../middleware.js");


const multer  = require('multer')
const {storage}=require('../cloudConfig.js')
const upload = multer({ storage })

//controllers
const listingController = require("../controllers/listing.js");

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.message;
    next(new ExpressError(400, errMsg))
  } else {
    next();
  }
};

function asyncWrap(fun) {
  return function (req, res, next) {
    fun(req, res, next).catch((err) => next(err));
  };
}


//new rout
router.get("/create", isLoggedIn, listingController.renderNewForm);

router
  .route("/")
  .get(asyncWrap(listingController.index)) //index rout
  .post(upload.single('Listing[image]'),asyncWrap(listingController.created)); //create


router
  .route("/:id")
  .get(asyncWrap(listingController.showRout))
  .put(isLoggedIn, isOwner, upload.single('Listing[image]'),asyncWrap(listingController.update))
  .delete(isLoggedIn, isOwner, asyncWrap(listingController.delete));

//edit
router.get("/:id/edit", isLoggedIn, isOwner, asyncWrap(listingController.edit));

module.exports = router;
