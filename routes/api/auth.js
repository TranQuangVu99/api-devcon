const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../../middleware/auth");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");
//@route    GET api/auth
//@desc     Test route
//@access   Public
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

//@route    POST api/auth
//@desc     Authenticate user & get token
//@access   Public
router.post(
    "/",
    [ 
      check("email", "Please include a valid email").isEmail(),
      check(
        "password",
        "Password is required"
      ).exists()
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { email, password } = req.body;
  
      try {
        // See if user exists
        let user = await User.findOne({ email });
        if (!user) {
          res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
        }
        
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] })
        }
        const payload = {
          user: {
            id: user.id
          }
        };
  
        jwt.sign(
          payload,
          config.get("jwtSecret"),
          { expiresIn: 36000 },
          (err, token) => {
            if (err) throw err;
            res.json({ token });
          }
        );
  
        // Return JWT
  
        // res.send('User register')
      } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
      }
    }
  );
  
  //@route    GET api/users
  //@desc     Test route
  //@access   Public
  router.get("/", async (req, res) => {
    try {
      const users = await User.find();
      return res.json(users);
    } catch (error) {
      console.log(error);
      res.json({ msg: "Server Error" });
    }
  });
  
module.exports = router;
