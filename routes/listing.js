const express=require('express')
const router=express.Router();
const {listingSchema} = require('../schema.js');
const ExpressError=require('../error.js');
const Listing = require("../model/listings.js");


const validateListing=(req,res,next)=>{
    let { error }=listingSchema.validate(req.body)
      if(error){
        let errMsg=error.message
        throw new ExpressError(400,errMsg)
      }else{
        next()
      }
}

function asyncWrap(fun) {
    return function(req,res,next){
      fun(req,res,next).catch(err=>next(err));
    }
}  

router.get("/", asyncWrap(async (req, res,next) => {
  let data = await Listing.find();
  res.render("allData.ejs", { data });
}));

router.get("/create", (req, res) => {
  res.render("new.ejs");
});

//show rout
router.get("/:id", asyncWrap(async (req, res,next) => {
    let { id } = req.params;
    let data = await Listing.findById(id).populate('reviews');
    if(!data){
      req.flash('success','Listing you requested for does not exist!')
      res.redirect('/listings')
    }else{
      res.render("show.ejs", { data });
    }
}));

//create
router.post("/", validateListing,asyncWrap(async (req, res,next) => {
    let data = req.body.Listing;
    let listing = new Listing({ ...data });
    await listing.save();
    req.flash('success','New Listing Created !')
    res.redirect("/listings");
}));

//edit
router.get("/:id/edit", asyncWrap(async (req, res,next) => {
  let { id } = req.params;
    let userData = await Listing.findById(id);
    res.render("edit.ejs", { userData });
}));

// update
router.put("/:id",asyncWrap(async (req, res,next) => {
  let { id } = req.params;
  let data = req.body.Listing;
    await Listing.findByIdAndUpdate(id, { ...data });
    req.flash('success','Listing Updated !')
    res.redirect(`/listings/${id}`);
}));

// delete
router.delete("/:id", asyncWrap(async (req, res,next) => {
  let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success','Listing Deleted!')
    res.redirect(`/listings`);
}));

module.exports=router;