const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const db = require('../conf/database');
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.get('/registration', function(req, res) {
  res.render('registration', { title: 'Registration' });
});

router.get('/login', function(req, res) {
  res.render('login', { title: 'Login' });
});

router.post('/registration', async function(req, res, next) {
  try {
    const { username, email, password, 'confirm-password': confirmPassword, 'age-confirmation': ageConfirmation, 'tos-confirmation': tosConfirmation } = req.body;
    const errors = [];

    if (!username || !email || !password || !confirmPassword || !ageConfirmation || !tosConfirmation) {
      throw new Error('Please fill in all the required fields.');
    }

    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9]{2,}$/;
    if (!usernameRegex.test(username)) {
      errors.push('Invalid username');
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[/*\-+!@#$^&~[\]])[A-Za-z\d/*\-+!@#$^&~[\]]{8,}$/;
    if (!passwordRegex.test(password)) {
      errors.push('Invalid password');
    }
    if (password !== confirmPassword) {
      errors.push('Confirm password does not match password');
    }
    if (!ageConfirmation) {
      errors.push('User is not 13+ years old');
    }
    if (!tosConfirmation) {
      errors.push('User did not accept TOS and Privacy rules');
    }

    if (errors.length > 0) {
      return res.render('registration', { title: 'Registration', errors });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    await connection.execute(query, [username, email, hashedPassword]);
    res.redirect('/users/login');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}); 

router.post('/login', async function(req, res, next) {
  const { username, password } = req.body;
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    const [rows] = await connection.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0) {
      res.render('login', { title: 'Login', errorMessage: 'Invalid username or password' });
      return;
    }

    const match = await bcrypt.compare(password, rows[0].password);
    if (!match) {
      res.render('login', { title: 'Login', errorMessage: 'Invalid username or password' });
      return;
    }

    req.session.user = rows[0];
    res.redirect('/users/profile');
  } catch (error) {
    console.log(error);
    res.send('An error occurred');
  } finally {
    await connection.end();
  }
});

function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  } else {
    res.redirect('/users/login');
  }
}

router.get('/profile', ensureAuthenticated, async (req, res, next) => {
  const userId = req.session.user.id;
  if (!userId) {
    return res.status(400).send('No user in session');
  }

  let connection; 

  try {
    connection = await db.getConnection();
    const [userRows] = await connection.execute('SELECT * FROM users WHERE id = ?', [userId]);
    if (!userRows || userRows.length === 0) {
      return res.status(404).send('User not found');
    }

    const user = userRows[0];
    const [postRows] = await connection.execute('SELECT * FROM posts WHERE userId = ?', [userId]);
    const posts = postRows.map(post => {
      const filePathUrl = post.filePath.replace('uploads/', '/uploads/');
      const thumbnailPathUrl = post.thumbnailPath ? post.thumbnailPath.replace('uploads/', '/uploads/') : null;
      return { ...post, filePath: filePathUrl, thumbnailPath: thumbnailPathUrl };
    });

    res.render('profile', { user: user, posts: posts, success_msg: req.flash('success_msg') });
  } catch (err) {
    res.status(500).send('Internal Server Error');
  } finally {
    if (connection && connection.release) connection.release();
  }
});


router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if(err) {
      return console.log(err);
    }
    res.redirect('/users/login');
  });
});

module.exports = router;
