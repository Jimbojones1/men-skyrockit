const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');

// import middleware
// should be set up after the session!
const isSignedIn = require('./middleware/is-signed-in.js')
const passUserToView = require('./middleware/pass-user-to-view.js')

const authController = require('./controllers/auth.js');
const applicationController = require('./controllers/applications.js')

const port = process.env.PORT ? process.env.PORT : '3000';

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passUserToView); // this middleware function makes the logged in user 
// variable availiable globally

app.get('/', (req, res) => {
  if(req.session.user) {
    // restful routing /users/:userid/applications
    res.redirect(`/users/${req.session.user._id}/applications`)
  } else {
    // render the regular homepage
    res.render('index.ejs', {
      user: req.session.user,
    });
  }
});


app.use('/auth', authController);
app.use('/users/:userId/applications', applicationController)

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
