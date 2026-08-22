const express = require("express");

const router = express.Router();

const Product = require("../models/Product");

const verifyToken = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");


// =====================================
// PRODUCT INVENTORY SUMMARY
// =====================================

router.get(
"/inventory",
verifyToken,
isAdmin,
async(req,res)=>{

try{


const totalProducts =
await Product.countDocuments();



const lowStock =
await Product.find({
stock:{
$lte:5
}
});


const outOfStock =
await Product.find({
stock:0
});



const stockValue =
await Product.aggregate([
{
$group:{
_id:null,

value:{
$sum:{
$multiply:[
"$stock",
"$price"
]
}
}

}
}
]);



res.json({

totalProducts,

lowStockProducts:lowStock.length,

outOfStockProducts:outOfStock.length,

inventoryValue:
stockValue.length
?
stockValue[0].value
:
0,

lowStock,

outOfStock

});


}catch(err){

res.status(500).json({
error:err.message
});

}

});



// =====================================
// TOP SELLING PRODUCTS
// =====================================

router.get(
"/top-selling",
verifyToken,
isAdmin,
async(req,res)=>{


try{


const products =
await Product.find()

.sort({
soldCount:-1
})

.limit(10);



res.json(products);



}catch(err){

res.status(500).json({
error:err.message
});

}


});



module.exports = router;