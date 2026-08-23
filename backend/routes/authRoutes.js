const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "AUTH ROUTES ARE WORKING",
  });
});