const mongoose = require("mongoose");

const adminLogSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    adminEmail: {
      type: String,
    },
    action: {
      type: String,
      required: true,
    },
    activity: {
      type: String,
      required: true,
    },
    details: {
      type: String,
    },
    targetId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AdminLog", adminLogSchema);
