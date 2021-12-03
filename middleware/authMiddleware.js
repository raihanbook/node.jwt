const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Check json web token exists & is verified
const authRequire = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, 'secret', (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.cookie('next', req.path, { httpOnly: true });
        res.cookie('flash', 'flash', { maxAge: 1000 });
        res.redirect('/login');
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.cookie('next', req.path, { httpOnly: true });
    res.cookie('flash', 'flash', { maxAge: 1000 });
    res.redirect('/login');
  }
};

// Check current user's information
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  const flash = req.cookies.flash;
  
  if (token) {
    jwt.verify(token, 'secret', async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        res.locals.flash = flash;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    res.locals.flash = flash;
    next();
  }
};

module.exports = { authRequire, checkUser };