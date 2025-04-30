const User = require("../model/user");

module.exports.createAccount = (req, res, next) => {
  res.render("./user/userSignUpForm.ejs");
};

module.exports.signup = async (req, res, next) => {
  let { username, email, password } = req.body;
  const newUser = new User({ email, username });
  const data = await User.register(newUser, password);
  req.login(data, (error) => {
    if (error) {
      return next(error);
    }
    req.flash("success", "Welcome to wanderlust");
    res.redirect("/listings");
  });
};

module.exports.loginForm = (req, res, next) => {
  res.render("./user/loginForm.ejs");
};

module.exports.login = async (req, res, next) => {
  req.flash("success", "Successfull login to wanderlust");
  let redirectUrl = res.locals.redirectUrl || "listings";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      next(err);
    }
    req.flash("success", "Successfull logout");
    res.redirect("/listings");
  });
};
