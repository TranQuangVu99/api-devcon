const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");

//@route    POST api/users
//@desc     REgister route
//@access   Public
router.post(
  "/",
  [
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more character"
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // See if user exists
      let user = await User.findOne({ email });
      if (user) {
        res.status(400).json({ errors: [{ msg: "User already exists" }] }); // User đã tồn tại
      }
      // Get user gravatar
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
        
      });

      user = new User({
        name,
        email,
        avatar,
        password
      });
      //Encrypt passsord
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);
      
      await user.save();
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

//@route    GET api/users
//@desc     Test route
//@access   Public

// router.post('/',[check('name','not null').not()],async (req,res)=>{
//     try {
//         const errors = validationResult(req);
//         if(!errors.isEmpty())
//              res.json(errors);

//         const users = await User.find();
//         return res.json(users);

//     } catch (error) {
//         console.log(error)
//         res.json({msg:'Server Error'})
//     }
// })

module.exports = router;
