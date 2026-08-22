const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
{

// Basic information
name: {
type: String,
required: true,
trim: true
},

slug: {
type: String,
unique: true,
sparse: true
},

description: {
type: String,
required: true
},


// Pricing

price: {
type: Number,
required: true,
min: 0
},


discountPrice: {
type: Number,
default: null
},


// Images

images: [
{
type:String
}
],


// Category

category:{
type:String,
required:true
},


brand:{
type:String,
default:""
},


// Inventory

stock:{
type:Number,
default:0,
min:0
},


sku:{
type:String,
unique:true,
sparse:true
},


// Status

status:{
type:String,
enum:[
"active",
"inactive",
"out_of_stock"
],
default:"active"
},



// ⭐ Reviews

ratings:[

{

user:{
type:mongoose.Schema.Types.ObjectId,
ref:"User",
required:true
},


name:{
type:String,
default:""
},


rating:{
type:Number,
required:true,
min:1,
max:5
},


comment:{
type:String,
default:""
},


createdAt:{
type:Date,
default:Date.now
}


}

],



averageRating:{
type:Number,
default:0
},



// Sales

soldCount:{
type:Number,
default:0
},

  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

// Admin owner

createdBy:{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
}


},
{
timestamps:true
});


module.exports =
mongoose.model(
"Product",
productSchema
);