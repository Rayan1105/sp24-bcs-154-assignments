module.exports = {
  isLoggedIn: function(req, res, next) {
    if (req.session && req.session.user) {
      return next();
    }
    req.flash('error', 'You need to be logged in to access this page.');
    res.redirect('/login');
  },
  
  isAdmin: function(req, res, next) {
    if (req.session && req.session.user && req.session.user.role === 'admin') {
      return next();
    }
    req.flash('error', 'Access denied: Admins only.');
    res.redirect('/');
  }
};
