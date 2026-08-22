const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
},


items: [
{
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },

    name: String,

    price: Number,

    quantity: Number
}
],


totalAmount: {
    type: Number,
    required: true
},


// ===============================
// ORDER STATUS
// ===============================
status: {

    type: String,

    enum:[
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "out_for_delivery",
        "delivered",
        "cancelled"
    ],

    default:"pending"
},



// ===============================
// PAYMENT
// ===============================

paymentStatus: {

    type:String,

    enum:[
        "unpaid",
        "pending",
        "paid",
        "failed"
    ],

    default:"unpaid"
},


paymentMethod: {

    type:String,

    default:"chapa"

},


transactionId: {

    type:String,

    default:null

},



// ===============================
// 🚚 ORDER TRACKING
// ===============================


trackingNumber: {

    type:String,

    default:null

},



trackingHistory:[

{

    status:{
        type:String
    },


    message:{
        type:String
    },


    date:{
        type:Date,
        default:Date.now
    }

}

]



}, 
{
timestamps:true
});


module.exports = mongoose.model(
"Order",
orderSchema
);