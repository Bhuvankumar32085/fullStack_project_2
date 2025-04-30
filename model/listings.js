const mongoose = require("mongoose");
const Schema=mongoose.Schema
const Review = require('./review.js');
const User=require('./user.js')

const Schemaa =new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    url:String,
    filename:String
  },
  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  reviews:[
    {type:Schema.Types.ObjectId,
    ref:'Review'} 
  ],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User"
  }
});

Schemaa.post('findOneAndDelete',async(lising)=>{
  if(lising){
    await Review.deleteMany({_id:{$in:lising.reviews}})
  }
})


const Listing = mongoose.model("Listing", Schemaa);
module.exports = Listing;
