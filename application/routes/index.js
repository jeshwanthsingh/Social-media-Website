var express = require('express');
var router = express.Router();

/* GET home page. */
router.get("/index", function(req,res){
  res.render('index');
  })

router.get("/login", function(req,res) {
    res.render('login',{ title: 'Login' css: ["login.css"]});
});

router.get("/postvideo", function(req,res){
  res.render('postvideo');
  })

router.get("/registration", function(req,res){
  res.render('registration');
  })

router.get("/profile", function(req,res){
  res.render('profile');
  })

router.get("/viewpost", function(req,res){
  res.render('viewpost');
  })  



module.exports = router;
