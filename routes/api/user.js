const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const config = require('config');

/**
 * @route   POST api/user
 * @desc    Register user
 * @access  Public
 * @404 is bad request
 */
//middleware
router.post('/',
  [
    check('name', 'Name is requiresd').not().isEmpty(),
    check('email', 'please include valid email address').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  async (req, res) => {
    console.log('user body', req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    try {
      let user = await User.findOne({ email })
      // See if user exists
      if (user) {
        return res.status(400).json({
          errors: [
            {
              msg: 'User Already exists'
            }
          ]
        });
      }
      //Get users gravatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      })

      user = new User({
        name,
        email,
        avatar,
        password
      })
      //Encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();  //return promise so we use await
      //Return  jsonwebtoken
      const payload = {
        user: {
          id: user.id
        }
      }
      jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000 },
        (err, token) => {
          //if (err) throw err;
          if(err){
            console.error(err.message);
          }
          res.json({ token });
        }
      );
      //res.send('User Register');
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
