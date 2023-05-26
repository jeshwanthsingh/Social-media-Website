module.exports = (ensureAuthenticated) => {
  const express = require('express');
  const router = express.Router();
  const db = require('../conf/database');
  const multer = require('multer');
  const ffmpeg = require('fluent-ffmpeg');
  const path = require('path');

  const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
      const date = new Date().toISOString().replace(/:/g, '-').replace(/\./g, '_');
      cb(null, date + '-' + file.originalname);
    }
  });

  const upload = multer({ storage: storage });

  router.get('/postvideo', ensureAuthenticated, function(req, res) {
    res.render('postvideo', { title: 'Postvideo' });
  });

  router.post('/postvideo', ensureAuthenticated, upload.single('video-file'), async function(req, res, next) {
    const { title, content } = req.body;
    const filePath = req.file.path;
    const userId = req.session.user.id;
    const filename = path.parse(req.file.originalname).name;

    ffmpeg(filePath)
      .screenshots({
        timestamps: ['00:00:01'],
        filename: `${filename}-thumbnail.png`,
        folder: './uploads/thumbnails/',
        size: '320x240'
      })
      .on('end', async function() {
        const thumbnailPath = `uploads/thumbnails/${filename}-thumbnail.png`; 

        const query = 'INSERT INTO posts (title, content, userId, filePath, thumbnailPath) VALUES (?, ?, ?, ?, ?)';
        const [resultSet] = await db.execute(query, [title, content, userId, filePath, thumbnailPath]);

        const [postRows] = await db.execute('SELECT * FROM posts WHERE id = ?', [resultSet.insertId]);
        const post = postRows[0];

        res.render('viewpost', { title: 'View Post', post: post });
      })
      .on('error', function(err) {
        res.status(500).send('Internal Server Error');
      });
  });


  router.get('/search', async function(req, res, next) {
    const searchTerm = req.query.q;

    const searchQuery = 'SELECT * FROM posts WHERE title LIKE ?';
    
    const connection = await db.getConnection();

    const [searchResults] = await connection.query(searchQuery, [`%${searchTerm}%`]);
    
    connection.release();

    res.render('profile', { title: 'Search Results', posts: searchResults });
  });

  router.post('/comments', ensureAuthenticated, async function(req, res, next) {
    const { comment, postId } = req.body;
    const userId = req.session.user.id;

    if (!postId) {
        return res.status(400).send('postId is required');
    }

    const postIdNumber = Number(postId);
    if (isNaN(postIdNumber)) {
        return res.status(400).send('postId must be a number');
    }

    const query = 'INSERT INTO comments (content, userId, postId) VALUES (?, ?, ?)';
    await db.execute(query, [comment, userId, postIdNumber]);

    res.redirect('/viewpost/' + postId);
  });

  router.get('/viewpost/:postId', ensureAuthenticated, async function(req, res, next) {
    const postId = req.params.postId;

    const postQuery = 'SELECT * FROM posts WHERE id = ?';
    const commentQuery = 'SELECT * FROM comments WHERE postId = ?';
    
    const connection = await db.getConnection();

    const [postRows] = await connection.query(postQuery, [postId]);
    const post = postRows[0];

    let filePathUrl;
    if (post.filePath.startsWith('./uploads/')) {
      filePathUrl = post.filePath.replace('./uploads/', '/uploads/');
    } else if (post.filePath.startsWith('/uploads/')) {
      filePathUrl = post.filePath;
    } else if (post.filePath.startsWith('uploads/')) {
      filePathUrl = '/' + post.filePath;
    }
    
    const thumbnailPathUrl = post.thumbnailPath ? post.thumbnailPath.replace('./uploads/', '/uploads/') : null;

    const [comments] = await connection.query(commentQuery, [postId]);

    connection.release();

    res.render('viewpost', { title: 'View Post', post: {...post, filePath: filePathUrl, thumbnailPath: thumbnailPathUrl}, comments });
  });

  router.get('/edit/:id', ensureAuthenticated, async function(req, res, next) {
    const { id } = req.params;
    const query = 'SELECT * FROM posts WHERE id = ?';
    const [rows] = await db.execute(query, [id]);
    res.render('edit_post', { title: 'Edit Post', post: rows[0] });
  });

  router.post('/edit/:id', ensureAuthenticated, async function(req, res, next) {
    const { id } = req.params;
    const { title, content } = req.body;
    const query = 'UPDATE posts SET title = ?, content = ? WHERE id = ?';
    await db.execute(query, [title, content, id]);
    res.redirect('/users/profile');
  });

  router.post('/deletepost/:id', ensureAuthenticated, async function(req, res, next) {
    const { id } = req.params;
    const query = 'DELETE FROM posts WHERE id = ?';
    await db.execute(query, [id]);
    res.redirect('/viewpost');
  });

  return router;
}
