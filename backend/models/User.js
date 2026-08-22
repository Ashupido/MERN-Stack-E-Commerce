const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    trim: true
  },


  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },


  password: {
    type: String,
    required: true
  },


  // User permission level
  role: {
    type: String,
    enum: [
      "user",
      "seller",
      "manager",
      "admin"
    ],
    default: "user"
  },


  phone: {
    type: String,
    default: ""
  },


  address: {
    type: String,
    default: ""
  },


  // Account control
  status: {
    type: String,
    enum: [
      "active",
      "inactive"
    ],
    default: "active"
  },


  // Profile image
  avatar: {
    type: String,
    default: ""
  },


  // Activity tracking
  lastLogin: {
    type: Date,
    default: null
  },


  // Optional future fields
  isVerified: {
    type: Boolean,
    default: false
  }


}, {
  timestamps: true
});


// Update last login time
userSchema.methods.updateLastLogin = async function () {

  this.lastLogin = new Date();

  await this.save();

};


module.exports = mongoose.model(
  "User",
  userSchema
);