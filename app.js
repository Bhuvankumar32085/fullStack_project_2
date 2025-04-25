const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const app = express();
const ExpressError=require('./error.js');

//passcort
const passport=require('passport')
const localStrategy=require('passport-local')

//model
const User=require('./model/user.js')

//router
const listingsRouter=require('./routes/listing.js')
const reviewsRouter=require('./routes/reviews.js')
const userRouter=require('./routes/user.js')

//express-session
const session=require('express-session')

app.use(session({
  secret: 'bhuvan32085',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 din
    httpOnly: true,
    // secure: true, // Agar HTTPS par ho to isse bhi enable karo
  }
}));

//flash
const flash=require('connect-flash')
app.use(flash())

//passport ---------
app.use(passport.initialize());
app.use(passport.session());
// use static authenticate method of model in LocalStrategy
passport.use(new localStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//ejs-mate for provide styling for ejs html file
const engine = require('ejs-mate')
app.engine('ejs', engine);

// methoo-override use
app.use(methodOverride("_method"));

// connect ejs path
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

// conect static file
app.use(express.static(path.join(__dirname, "/public")));

// parse data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req,res,next)=>{
  req.Time=new Date(Date.now()).toString();
  next()
})

//DB connection 
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

main()
  .then(() => {
    console.log("connection successfull");
  })
  .catch((err) => {
    console.log(`connection err ${err}`);
  });

// routing
app.get("/", (req, res) => {
  res.send("root");
});

//flash middleware
app.use((req,res,next)=>{
  res.locals.success=req.flash('success');
  res.locals.error=req.flash('error');
  res.locals.currUser=req.user;
  next()
})

//listings rout 
app.use('/listings',listingsRouter)

//reviews rout 
app.use('/listings/:id/reviews',reviewsRouter)

//reviews rout 
app.use('/',userRouter)

//page not found
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

//erroe handelar middelware
app.use((err,req ,res ,next)=>{
  let {status=500,message="some error"}=err;
  res.status(status).send(message)
})

app.listen(3000, () => {
  console.log("listen server port 3000");
});
