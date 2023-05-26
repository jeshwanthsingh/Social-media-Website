const express = require('express');
const router = express.Router();
const db = require('../conf/database');
const bcrypt = require('bcrypt');

router.get('/index', async function(req, res) {
  try {
    const query = 'SELECT * FROM posts';
    
    const connection = await db.getConnection();

    const [rows] = await connection.query(query);
    connection.release();

    if (Array.isArray(rows)) {
      const posts = rows.map(row => {
        const filePathUrl = row.filePath.replace('uploads/', '/uploads/');
        let thumbnailPathUrl = null;
        if (row.thumbnailPath) {
          thumbnailPathUrl = row.thumbnailPath.replace('uploads/', '/uploads/');
        }
        return { ...row, filePath: filePathUrl, thumbnailPath: thumbnailPathUrl };
      });
      res.render('index', { title: 'Home', posts });
    } else {
      throw new Error("Result of the query is not an array");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/search', async function(req, res, next) {
  const searchTerm = req.query.q;

  const searchQuery = 'SELECT * FROM posts WHERE title LIKE ?';
  
  const connection = await db.getConnection();

  const [searchResults] = await connection.query(searchQuery, [`%${searchTerm}%`]);
  
  connection.release();

  res.render('index', { title: 'Search Results', posts: searchResults });
});


router.get('/postvideo', function(req, res) {
  res.render('postvideo', { title: 'Postvideo' });
});

router.get('/viewpost', function(req, res) {
  res.render('viewpost', { title: 'Viewpost' });
});

router.get('/images/CSC317.jpeg', function(req, res) {
  res.sendFile('CSC317.jpeg', { root: './public/images' });
});

module.exports = router;
