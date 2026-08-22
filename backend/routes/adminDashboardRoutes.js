const express = require("express");

const router = express.Router();

const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

const verifyToken = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");


// =====================================

// =====================================

router.get(
"/summary",
verifyToken,
isAdmin,
async (req,res)=>{

try{


// total users
const totalUsers = await User.countDocuments();


// total products
const periodDays = {
"7d": 7,
"30d": 30,
"90d": 90,
"1y": 365
}[req.query.period] || 30;

const startDate = new Date();
startDate.setDate(startDate.getDate() - periodDays);
const totalProducts = await Product.countDocuments();


// total orders
const totalOrders = await Order.countDocuments();


// paid orders
const paidOrders = await Order.countDocuments({
paymentStatus:"paid"
});


// pending orders
const pendingOrders = await Order.countDocuments({
paymentStatus:"pending"
});


// total revenue

const revenue = await Order.aggregate([
{
$match:{
paymentStatus:"paid"
}
},
{
$group:{
_id:null,
total:{
$sum:"$totalAmount"
}
}
}
]);


const activeSellers = await User.countDocuments({
role:"seller",
status:"active"
});


const orderStatusDistribution = await Order.aggregate([
{
$group:{
_id:"$status",
value:{$sum:1}
}
},
{
$project:{
_id:0,
name:"$_id",
value:1
}
}
]);


const monthlySales = await Order.aggregate([
{
$match:{
paymentStatus:"paid",
createdAt:{$gte:startDate}
}
},
{
$group:{
_id:{$month:"$createdAt"},
revenue:{$sum:"$totalAmount"},
}
},
{
$sort:{month:1}
},
{
$project:{
_id:0,
name:{$arrayElemAt:[
["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
{$subtract:["$_id",1]}
]},
revenue:1
}
}
]);


const recentOrders = await Order.find()
.sort({createdAt:-1})
.limit(5)
.populate("user","name email");


res.json({

totalUsers,

totalProducts,

totalOrders,

paidOrders,

pendingOrders,

totalRevenue:
revenue.length > 0
? revenue[0].total
:0,

activeSellers,

orderStatusDistribution,

monthlySales,

recentOrders


});


}catch(err){

res.status(500).json({
error:err.message
});

}


});


// =====================================
// GET ALL ORDERS (ADMIN)
// =====================================

router.get(
"/orders",
verifyToken,
isAdmin,
async (req,res)=>{

try{

const {status}=req.query;


let filter={};


// filter by order status
if(status){

filter.status=status;

}


const orders = await Order.find(filter)

.populate("user","email")

.sort({
createdAt:-1
});


res.json({

totalOrders:orders.length,

orders

});


}catch(err){

res.status(500).json({
error:err.message
});

}

});



// =====================================
// GET SINGLE ORDER DETAILS (ADMIN)
// =====================================

router.get(
"/orders/:id",
verifyToken,
isAdmin,
async(req,res)=>{

try{


const order = await Order.findById(req.params.id)

.populate("user","email");



if(!order){

return res.status(404).json({
message:"Order not found"
});

}


res.json(order);



}catch(err){

res.status(500).json({
error:err.message
});

}

});



// =====================================
// UPDATE ORDER STATUS (ADMIN)
// =====================================


router.put(
"/orders/:id/status",
verifyToken,
isAdmin,
async(req,res)=>{


try{


const {status}=req.body;


const allowedStatus=[
"pending",
"confirmed",
"shipped",
"delivered",
"cancelled"
];



if(!allowedStatus.includes(status)){

return res.status(400).json({

message:"Invalid status"

});

}



const order =
await Order.findById(req.params.id);



if(!order){

return res.status(404).json({

message:"Order not found"

});

}



order.status=status;


await order.save();



res.json({

message:"Order status updated",

order

});



}catch(err){

res.status(500).json({

error:err.message

});

}


});

module.exports = router;