const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const app = express();
const ExpressError=require('./error.js');
const listings=require('./routes/listing.js')
const reviews=require('./routes/reviews.js')

//express-session
const session=require('express-session')

app.use(session({
  secret:'bhuvan32085',
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
  }
}))

//flash
const flash=require('connect-flash')
app.use(flash())

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

//DB
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
  next()
})

//listings rout 
app.use('/listings',listings)

//reviews rout 
app.use('/listings/:id/reviews',reviews)

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
