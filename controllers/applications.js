const express = require('express')
const router = express.Router()

// applications are embedded in the User model
const UserModel = require('../models/user')

// localhost:3000/users/applications
router.get('/', function(req, res){
	res.render('applications/index.ejs')
})

module.exports = router;