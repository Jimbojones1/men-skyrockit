const express = require("express");
const router = express.Router();

// applications are embedded in the User model
const UserModel = require("../models/user");


router.delete('/:applicationId', async function(req, res){
	try {
		// find the user from the database
		const currentUser = await UserModel.findById(req.session.user._id)
		// find and delete the mongoose subdocument
		currentUser.applications.id(req.params.applicationId).deleteOne();
		// tell the db we removed the document and update database
		await currentUser.save()
		// redirect back to the index page
		res.redirect(`/users/${currentUser._id}/applications`)
	} catch(err){
		console.log(err)
		res.redirect('/')
	}
})


// localhost:3000/users/:userId/applications
router.get("/", async function (req, res) {
  try {
	// Look up the current user from our req.session!
	const currentUser = await UserModel.findById(req.session.user._id)
	// log currentUser if you have errors!
    res.render("applications/index.ejs", {
		applications: currentUser.applications
	});
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});

// /users/:userid/applications/new - the full route (New Page to send form for create)
router.get("/new", function (req, res) {
  res.render("applications/new.ejs");
});

// /users/:userid/applications/:applicationId - Show Page for application
router.get('/:applicationId', async function(req, res){
	try {
		console.log(req.session, " <--- req.session")
		// find the currentUser
		const currentUser = await UserModel.findById(req.session.user._id)
		// find the application whose id is in the params 
		// log out the currentUser
		console.log(currentUser, " <--- currentUser")
		const application = currentUser.applications.id(req.params.applicationId);

		res.render('applications/show.ejs', {
			application: application,
			// application <----- this is equalivent to the above line
		})
	} catch(err){
		console.log(err)
		res.redirect('/')
	}
})

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
    console.log(currentUser, " <- currentUser in CREATE");
    // respond to the client
    res.redirect(`/users/${currentUser._id}/applications`);
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});

module.exports = router;
