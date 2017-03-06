var express = require('express');
var router = express.Router();
var User = require('../models/users');
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/logout', function(req, res) {
   req.logout();
   req.flash('success_msg', 'You are logged out Successfully.');
   res.redirect('/users/login');
});

router.get('/registration', function(req, res, next) {
  res.render('registration');
});

router.post('/registration', function(req, res, next) {
  var name = req.body.name;
  var username= req.body.username;
  var password= req.body.password;
  var email = req.body.email;
  var newUser = new User({
  	name: name,
  	email: email,
  	password: password,
  	username: username
  });
  User.createUser(newUser, function(err, user) {
   if(err){
   	throw err;
   }
  });
  req.flash('success_msg', 'You are Register Successfully');
  res.redirect('/users/login');
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.getUserByUserName(username, function(err,user) {
    	if(err) throw err;
    	if(!user) {
    		return done(null, false, {message: 'User Not Found'});
    	}
    	User.compairPassword(password, user.password, function(err, isMatch) {
    		if(err) throw err;
    		if(isMatch) {
    			return done(null, user);
    		}else{
    			return done(null, false, {message: 'Invalid Password'})
    		}
    	})
    })
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/users/login',
                                   failureFlash: true }), function(req, res){
                                   res.redirect('/')
  });
module.exports = router;
