const express = require("express");

const router = express.Router();


const Address = require("../models/Address");

const verifyToken =
require("../middleware/authMiddleware");



// =====================================
// ➕ ADD ADDRESS
// =====================================

router.post(
"/",
verifyToken,
async(req,res)=>{

try{


const {

fullName,
phone,
city,
subCity,
street,
houseNumber,
isDefault

}=req.body;



// if default selected remove old default

if(isDefault){

await Address.updateMany(
{
user:req.user.id
},
{
isDefault:false
}
);

}



const address =
new Address({

user:req.user.id,

fullName,

phone,

city,

subCity,

street,

houseNumber,

isDefault

});


await address.save();



res.json({

message:"Address added",

address

});



}catch(err){

res.status(500).json({

error:err.message

});

}

});




// =====================================
// 📦 GET MY ADDRESSES
// =====================================

router.get(
"/",
verifyToken,
async(req,res)=>{


try{


const addresses =
await Address.find({

user:req.user.id

});


res.json(addresses);



}catch(err){

res.status(500).json({

error:err.message

});

}

});




// =====================================
// ⭐ SET DEFAULT ADDRESS
// =====================================

router.put(
"/default/:id",
verifyToken,
async(req,res)=>{


try{


await Address.updateMany(

{
user:req.user.id
},

{
isDefault:false
}

);



const address =
await Address.findOneAndUpdate(

{
_id:req.params.id,
user:req.user.id
},

{
isDefault:true
},

{
new:true
}

);



if(!address){

return res.status(404).json({

message:"Address not found"

});

}



res.json({

message:"Default address updated",

address

});



}catch(err){

res.status(500).json({

error:err.message

});

}

});




// =====================================
// ✏️ UPDATE ADDRESS
// =====================================

router.put(
"/:id",
verifyToken,
async(req,res)=>{


try{


const address =
await Address.findOneAndUpdate(

{
_id:req.params.id,
user:req.user.id
},

req.body,

{
new:true
}

);



if(!address){

return res.status(404).json({

message:"Address not found"

});

}



res.json({

message:"Address updated",

address

});



}catch(err){

res.status(500).json({

error:err.message

});

}


});




// =====================================
// ❌ DELETE ADDRESS
// =====================================

router.delete(
"/:id",
verifyToken,
async(req,res)=>{


try{


const address =
await Address.findOneAndDelete(

{
_id:req.params.id,
user:req.user.id
}

);



if(!address){

return res.status(404).json({

message:"Address not found"

});

}



res.json({

message:"Address deleted"

});



}catch(err){

res.status(500).json({

error:err.message

});

}


});


module.exports = router;