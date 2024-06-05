

function isSignedIn(req, res, next){
	if(req.session.user) return next(); // if the are logged in precede as normal

	res.redirect('/auth/sign-in')
}


module.exports = isSignedIn;