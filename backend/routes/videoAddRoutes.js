const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const { createVideo, showVideos } = require('../controllers/videoAddController');


//blog routes
router.post('/video/create', isAuthenticated, isAdmin, createVideo);
router.get('/videos/show', showVideos);
// router.get('/post/:id', showSinglePost);
// router.delete('/delete/post/:id', isAuthenticated, isAdmin, deletePost);
// router.put('/update/post/:id', isAuthenticated, isAdmin, updatePost);
// router.put('/comment/post/:id', isAuthenticated, addComment);
// router.put('/addlike/post/:id', isAuthenticated, addLike);
// router.put('/removelike/post/:id', isAuthenticated, removeLike);


module.exports = router;