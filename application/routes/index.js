const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

async function getConnection() {
  return await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Gleeba&@72',
    database: 'csc317db',
  });
}

router.get('/index', function(req, res) {
  res.render('index', { title: 'Home' });
});

router.get('/login', function(req, res) {
  res.render('login', { title: 'Login' });
});

router.get('/postvideo', function(req, res) {
  res.render('postvideo', { title: 'Postvideo' });
});

router.post('/registration', async function(req, res) {
  try {
    const { username, email, password } = req.body;
    const connection = await getConnection();
    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    await connection.query(query, [username, email, password]);
    connection.close();
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
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
