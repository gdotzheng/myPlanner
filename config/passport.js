var LocalStrategy = require("passport-local").Strategy;
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('./database');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);

// Authentication function
module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    connection.query("SELECT * FROM users WHERE id = ? ", [id],
      function(err, rows) {
        done(err, rows[0]);
      });
  });

  // Signing up
  passport.use(
    'local-signup',
    new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
      },
      // Function to make sure username isnt taken when signing up
      function(req, username, password, done) {
        connection.query("SELECT * FROM users WHERE username = ? ",
          [username],
          function(err, rows) {
            if (err)
              return done(err);
            if (rows.length) {
              return done(null, false, req.flash('signupMessage', 'That is already taken'));
            } else {

              // Encrypting the password
              var newUserMysql = {
                username: username,
                password: bcrypt.hashSync(password, null, null)
              };

              // Query for inserting user info into table
              var insertQuery = "INSERT INTO users (username, password) values (?, ?)";

              // Performing the query with username and password
              connection.query(insertQuery, [newUserMysql.username, newUserMysql.password],
                function(err, rows) {
                  newUserMysql.id = rows.insertId;
                  return done(null, newUserMysql);
                });
            }
          });
      })
  );

  // Logging in
  passport.use(
    'local-login',
    new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
      },
      // Function to make sure username and password matches with table when logging in
      function(req, username, password, done) {
        connection.query("SELECT * FROM users WHERE username = ? ", [username],
          function(err, rows) {
            if (err)
              return done(err);
            if (!rows.length) {
              return done(null, false, req.flash('loginMessage', 'No User Found'));
            }
            // Checking if password matches
            if (!bcrypt.compareSync(password, rows[0].password))
              return done(null, false, req.flash('loginMessage', 'Wrong Password'));
            return done(null, rows[0]);
          });
      })
  );
};
