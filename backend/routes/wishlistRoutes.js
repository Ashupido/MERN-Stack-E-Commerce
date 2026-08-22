const express = require("express");

const router = express.Router();


const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");


const verifyToken =
require("../middleware/authMiddleware");



// =====================================
// ❤️ ADD PRODUCT TO WISHLIST
// =====================================

router.post(
"/add",
verifyToken,
async(req,res)=>{

try{


const {productId}=req.body;



const product =
await Product.findById(productId);



if(!product){

return res.status(404).json({

message:"Product not found"

});

}



let wishlist =
await Wishlist.findOne({
user:req.user.id
});



// create wishlist if not exist

if(!wishlist){

wishlist = new Wishlist({

user:req.user.id,

products:[]

});

}



// prevent duplicate

const exists =
wishlist.products.includes(productId);



if(exists){

return res.status(400).json({

message:"Product already in wishlist"

});

}



wishlist.products.push(productId);



await wishlist.save();



res.json({

message:"Product added to wishlist",

wishlist

});



}catch(err){

res.status(500).json({

error:err.message

});

}

});




// =====================================
// ❤️ GET MY WISHLIST
// =====================================

router.get(
"/",
verifyToken,
async(req,res)=>{


try{


const wishlist =
await Wishlist.findOne({

user:req.user.id

})
.populate("products");



if(!wishlist){

return res.json({

products:[]

});

}



res.json(wishlist);



}catch(err){

res.status(500).json({

error:err.message

});

}


});




// =====================================
// ❌ REMOVE PRODUCT FROM WISHLIST
// =====================================

router.delete(
"/remove/:productId",
verifyToken,
async(req,res)=>{


try{


const wishlist =
await Wishlist.findOne({

user:req.user.id

});



if(!wishlist){

return res.status(404).json({

message:"Wishlist not found"

});

}



wishlist.products =
wishlist.products.filter(

product =>
product.toString()
!== req.params.productId

);



await wishlist.save();



res.json({

message:"Product removed from wishlist",

wishlist

});



}catch(err){

res.status(500).json({

error:err.message

});

}


});



module.exports = router;