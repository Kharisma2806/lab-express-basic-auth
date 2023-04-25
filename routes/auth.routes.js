const router = require("express").Router()
const bcrypt = require("bcryptjs")
const mongoose = require("mongoose")

const User = require("../models/User.model")

const saltRounds = 10;

const { isLoggedIn } = require('../middleware/route-guard.js')

router.get("/sign-up", (req, res) => {
  res.render("auth/signup-form");
});

router.post("/sign-up", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.render("auth/signup-form", {
        errorMessage: "Please fill out all the fields.",
      });
      return;
    }

    const user = await User.findOne({ username });
    if (user) {
      res.render("auth/signup-form", {
        errorMessage: "The username and/or email are in use.",
      });
      return;
    } 

    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    await User.create({ username, password: hashedPassword });
    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

router.get('/login', (req, res) => {
  res.render('auth/login-form');
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.render('auth/login-form', { errorMessage: 'Please fill out all the fields.' });
    return;
  }

 const user = await User.findOne({ username });

  if (!user) {
    res.render('auth/login-form', { errorMessage: 'Invalid username or password.' });
    return;
  }

  const isValidPassword = bcrypt.compareSync(password, user.password);
  if (!isValidPassword) {
    res.render('auth/login-form', { errorMessage: 'Invalid username or password.' });
    return;
  }
  req.session.user = user;
  console.log('THIS IS THE SESSION: ', req.session);
  res.redirect('/');
});

// Define the /main route
router.get('/main', isLoggedIn, (req, res) => {
  res.render('main', { user: req.session.currentUser }); // Render the main view with a user object to display the username
});

// Define the /private route
router.get('/private', isLoggedIn, (req, res) => {
  res.render('private', { user: req.session.currentUser }); // Render the private view with a user object to display the username
});

module.exports = router;
