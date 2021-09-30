const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authRequire = (req, res, next) => {
  const token = req.cookies.jwt;

  // Check json web token exists & is verified
  if (token) {
    jwt.verify(token, 'secret', (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        console.log(req.path);
        res.cookie('next', req.path, { httpOnly: true });
        res.redirect('/login');
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    console.log(req.path);
    res.cookie('next', req.path, { httpOnly: true });
    res.redirect('/login');
  }
};

// Check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, 'secret', async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = { authRequire, checkUser };