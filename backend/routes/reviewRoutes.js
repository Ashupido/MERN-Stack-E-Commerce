const express = require("express");

const router = express.Router();


const Product = require("../models/Product");

const verifyToken =
require("../middleware/authMiddleware");



// =====================================
// ADD REVIEW
// =====================================

router.post(
"/:productId",
verifyToken,
async(req,res)=>{


try{


const {
rating,
comment
}=req.body;



if(rating < 1 || rating > 5){

return res.status(400).json({

message:"Rating must be between 1 and 5"

});

}



const product =
await Product.findById(
req.params.productId
);



if(!product){

return res.status(404).json({

message:"Product not found"

});

}



// prevent duplicate review

const alreadyReviewed =
product.ratings.find(
r =>
r.user.toString()
===
req.user.id
);



if(alreadyReviewed){

return res.status(400).json({

message:"You already reviewed this product"

});

}



product.ratings.push({

user:req.user.id,

rating,

comment

});



// calculate average

const total =
product.ratings.reduce(
(sum,item)=>
sum + item.rating,
0
);


product.averageRating =
total / product.ratings.length;



await product.save();



res.json({

message:"Review added",

averageRating:
product.averageRating,

reviews:
product.ratings

});



}catch(err){

res.status(500).json({

error:err.message

});

}


});



// =====================================
// GET PRODUCT REVIEWS
// =====================================


router.get(
"/:productId",
async(req,res)=>{


try{


const product =
await Product.findById(
req.params.productId
)
.populate(
"ratings.user",
"name"
);



if(!product){

return res.status(404).json({

message:"Product not found"

});

}



res.json({

averageRating:
product.averageRating,

reviews:
product.ratings

});



}catch(err){

res.status(500).json({

error:err.message

});

}


});



module.exports=router;