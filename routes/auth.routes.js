const router = require("express").Router()
const bcrypt = require("bcryptjs")
const mongoose = require("mongoose")

const User = require("../models/User.model")

const saltRounds = 10;

router.get("/sign-up", (req, res) => {
  res.render("auth/signup-form");
});

// POST route to handle form submission
router.post("/sign-up", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    // Check if username already exists in database
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.render("auth/signup-form", { errorMessage: "Username already exists" });
    }

    // Hash the password using bcrypt
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user in the database
    await User.create({ username, password: hashedPassword });

    res.redirect("/login");
  } catch (error) {
    next(error);
  }
});

module.exports = router;