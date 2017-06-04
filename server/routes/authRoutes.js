const express = require('express');
const authController = require('../controllers/authController');

const authRoutes = express.Router();

const authHelpers = require('../services/auth/authHelpers');
const passport = require('../services/auth/local');

function loggedIn(req, res) {
  console.log('logged', req.user.username);
  console.log(req.isAuthenticated())
  res.json({user: req.user.username});
}

authRoutes.get('/login', (req, res) => {
  res.json({message: 'no good brah'});
})

authRoutes.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

authRoutes.post('/register', authController.create);

authRoutes.post('/login',
  passport.authenticate('local'), 
  (req, res) => {
    res.json(`req.user.username = ${req.user.username}`);
  })
  


authRoutes.post('/login',
  passport.authenticate('local', { successRedirect: '/users',
                                   failureRedirect: '/login' }));

module.exports = authRoutes;