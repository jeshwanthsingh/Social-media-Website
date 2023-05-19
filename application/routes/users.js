var express = require('express');
var router = express.Router();
var db = require('../conf/database');

async function getConnection() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  console.log('Connected to MySQL database:');
  console.log(`  Host: ${connection.config.host}`);
  console.log(`  Port: ${connection.config.port}`);
  console.log(`  User: ${connection.config.user}`);
  console.log(`  Database: ${connection.config.database}`);

  return connection;
}

/* POST localhost:3000/users/register */
router.post('/registration', async function(req, res, next) {
  try {
    const { username, email, password } = req.body;
    
    // Validate input fields
    if (!username || !email || !password) {
      throw new Error('Please fill in all the required fields.');
    }

    // Save the registration data to the database
    // Assuming you have a 'users' table in your database
    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    await db.query(query, [username, email, password]);

    // Registration successful, redirect to login page or send response
    res.send('/login');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;

