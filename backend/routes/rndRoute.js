const express = require('express');
const router = express.Router();

const { isAuthenticated, isAdmin } = require('../middleware/auth');
const { showRnd, showSingleRnd, deleteRnd, updateRnd, addComment, addLike, removeLike, createRnd } = require('../controllers/rndController');

//product routes
router.post('/rnd/create', isAuthenticated, isAdmin, createRnd);

router.get('/rnds/show', showRnd);
router.get('/rnd/:id', showSingleRnd);

router.delete('/delete/rnd/:id', isAuthenticated, isAdmin, deleteRnd);

router.put('/update/rnd/:id', isAuthenticated, isAdmin, updateRnd);

router.put('/comment/rnd/:id', isAuthenticated, addComment);

router.put('/addlike/rnd/:id', isAuthenticated, addLike);

router.put('/removelike/rnd/:id', isAuthenticated, removeLike);







module.exports = router;