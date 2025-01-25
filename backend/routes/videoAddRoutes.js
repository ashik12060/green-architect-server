const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const { createVideo, showVideos, showSingleVideo, deleteVideo, updateVideo } = require('../controllers/videoAddController');


//blog routes
router.post('/video/create', isAuthenticated, isAdmin, createVideo);
router.get('/videos/show', showVideos);
router.get('/video/:id', showSingleVideo);
router.delete('/delete/video/:id', isAuthenticated, isAdmin, deleteVideo);
router.put('/update/video/:id', isAuthenticated, isAdmin, updateVideo);



module.exports = router;