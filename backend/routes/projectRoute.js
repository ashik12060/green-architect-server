const express = require('express');
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const { createProject, deleteProject, updateProject, showSingleProject, showProject } = require('../controllers/projectController');
const router = express.Router();



//blog routes
router.post('/project/create', isAuthenticated, isAdmin, createProject);
router.get('/projects/show', showProject);
router.get('/project/:id', showSingleProject);
router.delete('/delete/project/:id', isAuthenticated, isAdmin, deleteProject);
router.put('/update/project/:id', isAuthenticated, isAdmin, updateProject);


module.exports = router;