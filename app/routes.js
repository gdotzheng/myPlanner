// Sets the homepage
module.exports = function(app, passport) {
 app.get('/', function(req, res){
  res.render('index.ejs');
 });

  // Rendering the login page
  app.get('/login', function(req, res){
    res.render('login.ejs', {message:req.flash('loginMessage')});
  });

  // Login authentication
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/home',
    failureRedirect: '/login',
    failureFlash: true
  }),

    // Function for session time
    function(req, res){
     if(req.body.remember){
      req.session.cookie.maxAge = 1000 * 60 * 3;
     }else{
      req.session.cookie.expires = false;
     }
     res.redirect('/');
    });

  // Rendering the signup page
  app.get('/signup', function(req, res){
    res.render('signup.ejs', {message: req.flash('signupMessage')});
  });

  // Signup authentication
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/home',
    failureRedirect: '/signup',
    failureFlash: true
  }));

  // Rendering the home page
  app.get('/home', isLoggedIn, function(req, res){
    res.render('home.ejs', {
      user:req.user
    });
  });

  // Rendering the courses page
  app.get('/courses', isLoggedIn, function(req, res){
    res.render('courses.ejs', {
      user:req.user
    });
  });

  // Logout
  app.get('/logout', function(req,res){
    req.logout();
    res.redirect('/');
    }
)};

// If user is authenticate then proceed to profile
function isLoggedIn(req, res, next){
 if(req.isAuthenticated())
  return next();
 res.redirect('/');
}
