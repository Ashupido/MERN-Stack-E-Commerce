const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const crypto = require("crypto");

const User = require("../models/User");

const router = express.Router();

const createToken = (user) => jwt.sign(
  { id: user._id, role: user.role },
  process.env.JWT_SECRET || "secretkey",
  { expiresIn: "1d" }
);

const getFrontendUrl = () => process.env.FRONTEND_URL || "http://localhost:5173";
const getGoogleCallbackUrl = () => (
  process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/api/auth/google/callback"
);

// Start Google OAuth. The redirect URI must match the Google Cloud client exactly.
router.get("/google", (req, res) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(503).json({ error: "Google login is not configured" });
  }

  const redirectUri = getGoogleCallbackUrl();
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "online",
    prompt: "select_account",
  });

  return res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
});

// Exchange Google's code, upsert the Pido user, then hand off the normal Pido JWT.
router.get("/google/callback", async (req, res) => {
  try {
    const { code, error } = req.query;
    if (error || !code) {
      return res.redirect(`${getFrontendUrl()}/login?oauthError=${encodeURIComponent("Google login was cancelled")}`);
    }

    const redirectUri = getGoogleCallbackUrl();
    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }).toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const profileResponse = await axios.get("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: { Authorization: `Bearer ${tokenResponse.data.access_token}` },
    });
    const { email, name, picture } = profileResponse.data;
    if (!email) throw new Error("Google did not provide an email address");

    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      user = await User.create({
        name: name || email.split("@")[0],
        email: email.toLowerCase(),
        password: await bcrypt.hash(crypto.randomBytes(32).toString("hex"), 10),
        role: "user",
        status: "active",
        avatar: picture || "",
        isVerified: true,
        lastLogin: new Date(),
      });
    } else {
      if (user.status === "inactive") {
        return res.redirect(`${getFrontendUrl()}/login?oauthError=${encodeURIComponent("Your account is inactive. Contact administrator.")}`);
      }
      user.lastLogin = new Date();
      if (!user.avatar && picture) user.avatar = picture;
      await user.save();
    }

    return res.redirect(`${getFrontendUrl()}/oauth/callback?token=${encodeURIComponent(createToken(user))}`);
  } catch (err) {
    console.error("Google OAuth error:", err.response?.data || err.message);
    return res.redirect(`${getFrontendUrl()}/login?oauthError=${encodeURIComponent("Google login failed")}`);
  }
});


// =====================================
// REGISTER
// =====================================
router.post("/register", async (req, res) => {

  try {

    const {
      name,
      email,
      password
    } = req.body;


    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Please provide name, email, and password"
      });
    }


    const existUser = await User.findOne({
      email
    });


    if (existUser) {

      return res.status(400).json({
        error: "User already exists with this email"
      });

    }


    const hashedPassword =
      await bcrypt.hash(password, 10);


    const user = new User({

      name,

      email,

      password: hashedPassword,

      role: "user",

      status: "active"

    });


    await user.save();


    const token = jwt.sign(

      {
        id: user._id,
        role: user.role
      },

      process.env.JWT_SECRET || "secretkey",

      {
        expiresIn: "1d"
      }

    );


    res.status(201).json({

      token,


      user: {

        _id: user._id,

        name: user.name,

        email: user.email,

        role: user.role,

        status: user.status

      }

    });



  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});




// =====================================
// REGISTER ADMIN (DEV ONLY)
// =====================================
router.post("/register-admin", async (req, res) => {

  try {

    const {
      name,
      email,
      password
    } = req.body;


    const existUser = await User.findOne({
      email
    });


    if (existUser) {

      return res.status(400).json({
        error: "User already exists"
      });

    }


    const hashedPassword =
      await bcrypt.hash(password, 10);



    const user = new User({

      name,

      email,

      password: hashedPassword,

      role: "admin",

      status: "active"

    });



    await user.save();



    const token = jwt.sign(

      {
        id: user._id,
        role: user.role
      },

      process.env.JWT_SECRET || "secretkey",

      {
        expiresIn: "1d"
      }

    );



    res.json({

      token,


      user: {

        _id: user._id,

        name: user.name,

        email: user.email,

        role: user.role,

        status: user.status

      }

    });



  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});




// =====================================
// LOGIN
// =====================================

router.post("/login", async (req,res)=>{


  try {


    const {
      email,
      password
    } = req.body;



    const user =
      await User.findOne({
        email
      });



    if(!user){

      return res.status(404).json({

        error:"User not found"

      });

    }



    // CHECK ACCOUNT STATUS

    if(user.status === "inactive"){

      return res.status(403).json({

        error:
        "Your account is inactive. Contact administrator."

      });

    }



    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );



    if(!isMatch){

      return res.status(401).json({

        error:"Wrong password"

      });

    }



    // UPDATE LAST LOGIN

    user.lastLogin = new Date();

    await user.save();



    const token =
      jwt.sign(

        {
          id:user._id,
          role:user.role
        },

        process.env.JWT_SECRET || "secretkey",

        {
          expiresIn:"1d"
        }

      );



    res.json({

      token,


      user:{

        _id:user._id,

        name:user.name,

        email:user.email,

        role:user.role,

        status:user.status,

        lastLogin:user.lastLogin

      }

    });



  } catch(err){


    res.status(500).json({

      error:err.message

    });


  }


});



module.exports = router;