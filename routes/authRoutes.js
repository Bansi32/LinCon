const express = require("express");
const router = express.Router();
const User = require("../models/users");
const passport = require("passport");

// to get the signup form
router.get("/register", (req, res) => {
  res.render("auth/register");
});

// registration of user
router.post("/register", async (req, res) => {
  try {
    const user = {
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
      location: req.body.location
    };
    const newUser = await User.register(user, req.body.password);
    console.log(newUser);
    res.redirect("/login");
  } catch (e) {
    console.log(e);
    res.redirect("/register");
  }
});

// to get the login page
router.get("/login", (req, res) => {
  res.render("auth/login");
});

// login the user
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
  }),
  (req, res) => {
    res.redirect("/home");
  }
);

// Logout user
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

module.exports = router;
