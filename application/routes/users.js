const express = require('express');
const router = express.Router();
const db = require('../conf/database');

router.get('/registration', function(req, res) {
  res.render('registration', { title: 'Registration' });
});

router.post('/registration', async function(req, res, next) {
  try {
    const { username, email, password } = req.body;

    // Validate input fields
    if (!username || !email || !password) {
      throw new Error('Please fill in all the required fields.');
    }

    // Save the registration data to the database
    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    await db.execute(query, [username, email, password]);

    // Registration successful, redirect to login page
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
