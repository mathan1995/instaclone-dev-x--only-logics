const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../keys');
const requireLogin = require('../middleware/requireLogin');

router.get('/', (req, res) => {
  res.send('hello from router');
});

router.get('/protected', requireLogin, (req, res) => {
  res.json({ message: 'hello User' });
});

//FOR SIGNUP
router.post('/signup', (req, res) => {
  // console.log(req.body.name);
  const { name, email, password, pic } = req.body;
  if (!email || !password || !name) {
    return res.status(422).json({ error: 'Please fill all the fields' });
  }
  User.findOne({ email: email }).then((savedUser) => {
    if (savedUser) {
      return res.status(422).json({ message: 'User already exists !' });
    }
    bcrypt
      .hash(password, 15)
      .then((hashedpassword) => {
        const user = new User({
          email,
          password: hashedpassword,
          name,
          pic,
        });
        user
          .save()
          .then((user) => {
            res.json({ message: 'User saved sucessfully' });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  });

  // res.json({ message: 'Sucessfully posted' });
});

//FOR SIGNIN
router.post('/signin', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(422).json({ error: 'please provie email and password' });
  }
  User.findOne({ email }).then((savedUser) => {
    if (!savedUser) {
      res.status(422).json({ error: 'Invalid email or password' });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((doMatch) => {
        if (doMatch) {
          // res.json({ message: 'Sucessfully signed in' });
          const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
          const { _id, name, email, followers, following, pic } = savedUser;
          res.json({
            token,
            user: { _id, name, email, followers, following, pic },
          });
        } else {
          return res.status(422).json({ error: 'Invalid email or password' });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});
module.exports = router;
