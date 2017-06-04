const db = require('../db/config');

const User = {};

User.findByUserName = userName => {
  return db.oneOrNone('SELECT * FROM users WHERE username = $1', [userName])
};

User.create = user => {
  console.log('in model')
  return db.one(
    `
      INSERT INTO users 
      (username, password)
      VALUES ($1, $2) RETURNING *
    `, [user.username, user.password]
  )
}

module.exports = User;