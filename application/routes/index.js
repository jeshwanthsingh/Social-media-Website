const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');



router.get('/index', function(req, res) {
  res.render('index', { title: 'Home' });
});

router.get('/login', function(req, res) {
  res.render('login', { title: 'Login' });
});

router.get('/postvideo', function(req, res) {
  res.render('postvideo', { title: 'Postvideo' });
});

router.get('/registration', function(req, res) {
  res.render('registration', { title: 'registration' });
});


router.get('/profile', function(req, res) {
  res.render('profile', { title: 'Profile' });
});

router.get('/viewpost', function(req, res) {
  res.render('viewpost', { title: 'Viewpost' });
});

router.get('/images/CSC317.jpeg', function(req, res) {
  res.sendFile('CSC317.jpeg', { root: './public/images' });
});

module.exports = router;
