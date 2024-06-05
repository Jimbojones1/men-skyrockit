const express = require("express");
const router = express.Router();

// applications are embedded in the User model
const UserModel = require("../models/user");

// localhost:3000/users/applications
router.get("/", function (req, res) {
  res.render("applications/index.ejs");
});

// /users/:userid/applications/new - the full route
router.get("/new", function (req, res) {
  res.render("applications/new.ejs");
});

// /users/:userid/applications
router.post("/", async function (req, res) {
  try {
    // we need to find current user
    const currentUser = await UserModel.findById(req.session.user._id);
    // then add the application (req.body, the contents of the form)
    // to currentUsers.applications array
    currentUser.applications.push(req.body);
    // save that update to the database
    await currentUser.save();
	console.log(currentUser, " <- currentUser in CREATE")
    // respond to the client
    res.redirect(`/users/${currentUser._id}/applications`);
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});

module.exports = router;
