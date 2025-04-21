const express = require("express");
const userRout = express.Router();
const User = require("../model/user.js");
const passport = require("passport");
const { saveOriginalUrl } = require("../middleware.js");

function asyncWrap(fun) {
  return function (req, res, next) {
    fun(req, res, next).catch((err) => next(err));
  };
}


//create account
userRout.get("/signup", (req, res, next) => {
  res.render("./user/userSignUpForm.ejs");
});

userRout.post(
  "/signup",
  asyncWrap(async (req, res, next) => {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const data = await User.register(newUser, password);
    req.login(data,(error)=>{
         if(error){
           return next(error)
         }
        req.flash("success", "Welcome to wanderlust");
        res.redirect("/listings");
    })
  })
);

//login
userRout.get("/login", (req, res, next) => {
  res.render("./user/loginForm.ejs");
});

userRout.post(
  "/login",
  saveOriginalUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  asyncWrap(async (req, res, next) => {
    req.flash("success", "Successfull login to wanderlust");
    let redirectUrl=res.locals.redirectUrl || 'listings'
    res.redirect(redirectUrl)
  })
);


//logout
userRout.get('/logout',(req,res)=>{
  req.logout((err)=>{
    if(err){
      next(err);
    }
    req.flash("success", "Successfull logout");
    res.redirect('/listings')
  })
})

module.exports = userRout;
