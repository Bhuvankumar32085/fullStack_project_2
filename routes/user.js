const express = require("express");
const userRout = express.Router();
const User = require("../model/user.js");
const passport = require("passport");

function asyncWrap(fun) {
  return function (req, res, next) {
    fun(req, res, next).catch((err) => next(err));
  };
}

userRout.get("/signup", (req, res, next) => {
  res.render("./user/userSignUpForm.ejs");
});

userRout.post(
  "/signup",
  asyncWrap(async (req, res, next) => {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const data = await User.register(newUser, password);
    req.flash("success", "Welcome to wanderlust");
    res.redirect("/listings");
  })
);

userRout.get("/login", (req, res, next) => {
  res.render("./user/loginForm.ejs");
});

userRout.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  asyncWrap(async (req, res, next) => {
    let { username, password } = req.body;
    req.flash("success", "Successfull login to wanderlust");
   res.redirect("/listings")
  })
);

module.exports = userRout;
