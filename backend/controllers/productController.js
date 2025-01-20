const cloudinary = require('../utils/cloudinary');
const Product = require('../models/productModel');
const ErrorResponse = require('../utils/errorResponse');
const main = require('../app');

//create post
exports.createProduct = async (req, res, next) => {
    const { title, content, postedBy, image} = req.body;

    try {
        //upload image in cloudinary
        const result = await cloudinary.uploader.upload(image, {
            folder: "products",
            width: 1200,
            crop: "scale"
        })
        const product = await Product.create({
            title: {
                en: title.en,  // English title
                bn: title.bn,  // Bengali title
                es: title.es,  // Spanish title
              },
              content: {
                en: content.en,  // English title
                bn: content.bn,  // Bengali title
                es: content.es,  // Spanish title
              },
            

            postedBy: req.user._id,
            image: {
                public_id: result.public_id,
                url: result.secure_url
            },

        });
        res.status(201).json({
            success: true,
            product
        })


    } catch (error) {
        console.log(error);
        next(error);
    }

}


//show products
exports.showProduct = async (req, res, next) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 }).populate('postedBy', 'name');
        res.status(201).json({
            success: true,
            products
        })
    } catch (error) {
        next(error);
    }

}


//show single post
exports.showSingleProduct = async (req, res, next) => {
    try {
        // Use Product model instead of Post
        const product = await Product.findById(req.params.id); // No need to populate for simple fields
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        res.status(200).json({
            success: true,
            product, // Return product data directly
        });
    } catch (error) {
        next(error);
    }
}


//delete post

exports.deleteProduct = async (req, res, next) => {
    try {
        const currentProduct = await Product.findById(req.params.id);

        if (!currentProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Delete image from Cloudinary if exists
        const ImgId = currentProduct.image.public_id;
        if (ImgId) {
            try {
                const cloudinaryResponse = await cloudinary.uploader.destroy(ImgId);
                console.log("Cloudinary Response:", cloudinaryResponse);
            } catch (cloudError) {
                console.error('Error deleting image from Cloudinary:', cloudError);
                return res.status(500).json({
                    success: false,
                    message: "Error deleting product image from Cloudinary"
                });
            }
        }

        // Delete the product from the database
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found during delete operation"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product deleted"
        });

    } catch (error) {
        console.error("Error deleting product:", error);
        next(error);
    }
};




// Update Product
exports.updateProduct = async (req, res, next) => {
    const { title, content, image } = req.body;  // Assuming title and content can be updated

    try {
        // Find the product by ID
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        // Upload new image to Cloudinary (if there's a new image)
        let imageResult = product.image; // keep existing image by default
        if (image) {
            const result = await cloudinary.uploader.upload(image, {
                folder: "products",
                width: 1200,
                crop: "scale"
            });
            imageResult = {
                public_id: result.public_id,
                url: result.secure_url
            };
        }

        // Update product fields
        product.title = {
            en: title.en || product.title.en,
            bn: title.bn || product.title.bn,
            es: title.es || product.title.es,
        };
        product.content = {
            en: content.en || product.content.en,
            bn: content.bn || product.content.bn,
            es: content.es || product.content.es,
        };
        product.image = imageResult;

        // Save updated product
        await product.save();

        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        console.error('Error updating product:', error.message);
        next(error);
    }
};





exports.reorderProducts = async (req, res) => {
    const { reorderedProducts } = req.body;
  
    try {
      // Using Promise.all for parallel updates
      const updatePromises = reorderedProducts.map((productId, index) => 
        Product.findByIdAndUpdate(productId, { order: index })
      );
  
      // Wait for all the update promises to resolve
      await Promise.all(updatePromises);
  
      // Retrieve the updated product list
      const updatedProducts = await Product.find().sort({ order: 1 });
  
      console.log("Updated products after reorder:", updatedProducts); // Debugging log
  
      res.status(200).json({ message: "Product order updated successfully", products: updatedProducts });
    } catch (err) {
      console.error("Failed to reorder products", err);
      res.status(500).json({ message: "Failed to reorder products" });
    }
  };
  