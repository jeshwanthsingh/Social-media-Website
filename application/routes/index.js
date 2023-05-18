const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function getConnection() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Gleeba&@72',
    database: 'CSC317DB',
  });

  console.log('Connected to MySQL database:');
  console.log(`  Host: ${connection.config.host}`);
  console.log(`  Port: ${connection.config.port}`);
  console.log(`  User: ${connection.config.user}`);
  console.log(`  Database: ${connection.config.database}`);

  return connection;
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

router.get('/registration', function(req, res) {
  res.render('registration', { title: 'registration' });
});

router.post('/registration', async function(req, res) {
  try {
    const { username, email, password } = req.body;
    
    // Validate input fields
    if (!username || !email || !password) {
      throw new Error('Please fill in all the required fields.');
    }

    console.log('Received registration data:');
    console.log('Username:', username);
    console.log('Email:', email);

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed Password:', hashedPassword);

    const connection = await getConnection();

    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    await connection.query(query, [username, email, hashedPassword]);
    connection.close();

    console.log('Registration successful! User data inserted into the database.');

    res.redirect('/login');
  } catch (error) {
    console.error('Error occurred during registration:', error);
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
