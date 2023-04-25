

const isLoggedIn = (req, res, next) => {
  console.log(`Session: ${req.session}`);
  if (!req.session.user) {
    return res.redirect('/');
  }
  next();
};

// const isLoggedOut = (req, res, next) => {
//   if (req.session.user) {
//     return res.redirect('/profile');
//   }
//   next();
// };
 
module.exports = {
  isLoggedIn
};