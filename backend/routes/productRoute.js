const express = require('express');
const { createProduct, showProduct, showSingleProduct, deleteProduct, updateProduct, reorderProducts,  } = require('../controllers/productController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const router = express.Router();



//blog routes
router.post('/product/create', isAuthenticated, isAdmin, createProduct);
router.get('/products/show', showProduct);
router.get('/product/:id', showSingleProduct);
router.put('/products/reorder',isAuthenticated, isAdmin,reorderProducts);

router.delete('/delete/product/:id', isAuthenticated, isAdmin, deleteProduct);
router.put('/update/product/:id', isAuthenticated, isAdmin, updateProduct);


module.exports = router;