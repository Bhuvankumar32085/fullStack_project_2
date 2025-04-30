const express = require("express");
const userRout = express.Router();

const passport = require("passport");
const { saveOriginalUrl } = require("../middleware.js");

//conteroller
const userController = require("../controllers/user.js");

function asyncWrap(fun) {
  return function (req, res, next) {
    fun(req, res, next).catch((err) => next(err));
  };
}

//create account
userRout.get("/signup", userController.createAccount);

userRout.post("/signup", asyncWrap(userController.signup));

//login
userRout.get("/login", userController.loginForm);

userRout.post(
  "/login",
  saveOriginalUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  asyncWrap(userController.login)
);

//logout
userRout.get("/logout", userController.logout);

module.exports = userRout;
