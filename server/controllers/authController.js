const User = require('../models/user.js');
const bcrypt = require('bcryptjs');

const authController = {};

authController.create = (req, res, next) => {
  console.log('in controller');
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(req.body.password, salt);

  User.create({
    username: req.body.username,
    password: hash,
  })
  .then(user => {
    req.login(user, err => {
      if (err) return next(err);
      console.log(req.session);
      res.json({ message: 'ok', data: { user }});
    });
  })
  .catch(err => {
    res.status(500).json(err);
  });
};

authController.loggedIn = (req, res) => {
  console.log(req.user);
}

module.exports = authController;