const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const { createCarousel, showCarousel, deleteCarousel, updateCarousel, showSingleCarousel } = require('../controllers/carouselController');


//blog routes
router.post('/carousel/create', isAuthenticated, isAdmin, createCarousel);
router.get('/carousels/show', showCarousel);
router.get('/carousel/:id', showSingleCarousel);
router.delete('/delete/carousel/:id', isAuthenticated, isAdmin, deleteCarousel);
router.put('/update/carousel/:id', isAuthenticated, isAdmin, updateCarousel);


module.exports = router;