const User = require("../models/User");
const AdminLog = require("../models/AdminLog");

const logActivity = async (req, action, activity, details = "", targetId = "") => {
  try {
    const user = await User.findById(req.user.id).select("email name role");
    await AdminLog.create({
      admin: req.user.id,
      adminEmail: user?.email || req.user.email || "system",
      actorRole: user?.role || req.user.role || "unknown",
      action,
      activity,
      details,
      targetId: String(targetId),
    });
  } catch (err) {
    console.error("Failed to write activity log:", err.message);
  }
};

module.exports = logActivity;
