const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();


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