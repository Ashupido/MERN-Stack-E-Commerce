const User = require("../models/User");

const isSeller = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== "seller" && user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Seller or Admin role required." });
    }
    next();
  } catch (err) {
    res.status(500).json({ error: "Server error during role verification." });
  }
};

module.exports = isSeller;