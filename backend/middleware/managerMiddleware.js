const User = require("../models/User");

const isManager = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== "manager" && user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Manager or Admin role required." });
    }
    next();
  } catch (err) {
    res.status(500).json({ error: "Server error during role verification." });
  }
};

module.exports = isManager;