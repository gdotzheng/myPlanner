var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var passport = require('passport');
var flash = require('connect-flash');
var mysql = require('mysql');
var app = express();
var port = process.env.PORT || 3000;

require('./config/passport')(passport);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Establishing database connection
var con = mysql.createConnection({
  host: "pickstracker.cojfykblcxek.us-east-2.rds.amazonaws.com",
  user: "admin",
  password: "1Dumbass!",
  database: "myplanner",
  multipleStatements: true
});

// Creating course table for user
app.post('/get_user_courses', function(req, res) {

  // Getting the user's name from AJAX call
  var name = req.body.name;

  // Query to make table based on user's name
  con.query('select * from courses where user = ?', name, function(err, resp) {
    if (err) throw err;

    var str = JSON.stringify(resp);

    rows = JSON.parse(str);

    return res.end(JSON.stringify(rows));

    // Refresh page
    res.redirect('back');
  });
});

// Creating course table for user
app.post('/get_user_assignments', function(req, res) {

  // Getting the user's name from AJAX call
  var name = req.body.name;

  // Query to make table based on user's name
  con.query('select * from assignments where user = ?', name, function(err, resp) {
    if (err) throw err;

    var str = JSON.stringify(resp);

    rows = JSON.parse(str);

    return res.end(JSON.stringify(rows));

    // Refresh page
    res.redirect('back');
  });
});

// Removing assignment on user's table
app.post('/remove_assignment', function(req, res) {

  // Getting the user's name from AJAX call
  var name = req.body.name

  var assignmentName = req.body.assignmentName;

  var courseID = req.body.courseID;

  con.query('delete from assignments where user = ? and assignment = ? and courseID = ?', [name, assignmentName, courseID], function(err, resp) {
    if (err) throw err;

    // Refresh page
    res.redirect('back');
  });
});

// removing course on user's table
app.post('/remove_course', function(req, res) {

  // Getting the user's name from AJAX call
  var name = req.body.name

  var courseID = req.body.courseID;

  con.query('delete from courses where user = ? and courseID = ?', [name, courseID], function(err, resp) {
    if (err) throw err;

    // Refresh page
    res.redirect('back');
  });
});

// Adding course to user's table
app.post('/add_course', function(req, res) {

  // Getting the user's name from AJAX call
  var user = req.body.name;

  var courseID = req.body.courseID;

  // Query to insert bet info into user's table
  con.query('insert into courses (user, courseID) values (?, ?) ', [user, courseID], function(err, resp) {
    if (err) throw err;

    // Refresh page
    res.redirect('back');
  });
});

// Adding assignment to user's table
app.post('/add_assignment', function(req, res) {

  console.log(req.body);

  // Getting the user's name from AJAX call
  var user = req.body.name;

  var assignment = req.body.assignmentName;

  var courseID = req.body.courses;

  var date = req.body.date;

  // Query to insert bet info into user's table
  con.query('insert into assignments (user, courseID, assignment, date) values (?, ?, ?, ?) ', [user, courseID, assignment, date], function(err, resp) {
    if (err) throw err;

    // Refresh page
    res.redirect('back');
  });
});

// get user's courses
app.post('/get_user_courses', function(req, res) {

  // Getting the user's name from AJAX call
  var name = req.body.name;

  // Query to make table based on user's name
  con.query('select * from courses where user = ?', name, function(err, resp) {
    if (err) throw err;

    var str = JSON.stringify(resp);

    rows = JSON.parse(str);

    return res.end(JSON.stringify(rows));
    
    // Refresh page
    res.redirect('back');
  });
});

// Setting the view engine to EJS
app.set('view engine', 'ejs');
app.use(express.static('.'));

app.use(session({
  secret: 'justasecret',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./app/routes.js')(app, passport);

app.listen(port);
console.log("Port: " + port);
