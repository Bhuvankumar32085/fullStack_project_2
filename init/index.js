const Listings=require('../model/listings')
const mongoose = require("mongoose");
const { data } = require('./data');


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

// let allListingData

async function init() {
    let newdata = data.map((obj) => ({ ...obj,owner:"6804be4fef35c080f6216122" }));
    await Listings.insertMany(newdata)
}

init()