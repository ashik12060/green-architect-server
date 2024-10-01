const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const { createMember, showMember, showSingleMember, deleteMember, updateMember } = require('../controllers/memberController');


//gallery routes
router.post('/member/create', isAuthenticated, isAdmin, createMember);
router.get('/members/show', showMember);
router.get('/member/:id', showSingleMember);
router.delete('/delete/member/:id', isAuthenticated, isAdmin, deleteMember);
router.put('/update/member/:id', isAuthenticated, isAdmin, updateMember);


module.exports = router;