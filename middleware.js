const Listing = require("./model/listings")
const Review = require("./model/review")

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl
        req.flash('error','You Must Be LogIn')
        return res.redirect('/login')
    }
    next()
}

module.exports.saveOriginalUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
       res.locals.redirectUrl=req.session.redirectUrl;
    }
    next()
}

module.exports.isOwner=async(req,res,next)=>{
    let { id } = req.params;
      let listdata=await Listing.findById(id)
    if(!listdata.owner._id.equals(res.locals.currUser._id)){
        req.flash('success','You do not have permission to edit !')
        return res.redirect(`/listings/${id}`);
    }
    next()
}
module.exports.isReviewAuther=async(req,res,next)=>{
    let { id,reviewId } = req.params;
      let reviewData=await Review.findById(reviewId)
    if(!reviewData.author._id.equals(res.locals.currUser._id)){
        req.flash('success','You do not have permission to delete !')
        return res.redirect(`/listings/${id}`);
    }
    next()
}