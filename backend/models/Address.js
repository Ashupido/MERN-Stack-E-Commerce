const mongoose = require("mongoose");


const addressSchema = new mongoose.Schema(
{

user:{
type:mongoose.Schema.Types.ObjectId,
ref:"User",
required:true
},


fullName:{
type:String,
required:true
},


phone:{
type:String,
required:true
},


country:{
type:String,
default:"Ethiopia"
},


city:{
type:String,
required:true
},


subCity:{
type:String,
default:""
},


street:{
type:String,
required:true
},


houseNumber:{
type:String,
default:""
},


isDefault:{
type:Boolean,
default:false
}


},
{
timestamps:true
});


module.exports =
mongoose.model(
"Address",
addressSchema
);