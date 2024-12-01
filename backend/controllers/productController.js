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


//show single product
exports.showSingleProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).populate('comments.postedBy', 'name');
        res.status(200).json({
            success: true,
            product
        })
    } catch (error) {
        next(error);
    }

}


//delete post
exports.deleteProduct = async (req, res, next) => {
    const currentProduct = await Product.findById(req.params.id);

    //delete post image in cloudinary       
    const ImgId = currentProduct.image.public_id;
    if (ImgId) {
        await cloudinary.uploader.destroy(ImgId);
    }

    try {
        const product = await Product.findByIdAndRemove(req.params.id);
        res.status(200).json({
            success: true,
            message: "Product deleted"
        })

    } catch (error) {
        next(error);
    }

}


//update Product
exports.updateProduct = async (req, res, next) => {
    try {
        const { title, content, image } = req.body;
        const currentProduct = await Product.findById(req.params.id);

        //build the object data
        const data = {
            title: title || currentProduct.title,
            content: content || currentProduct.content,
            image: image || currentProduct.image,
        }

        //modify Product image conditionally
        if (req.body.image !== '') {

            const ImgId = currentProduct.image.public_id;
            if (ImgId) {
                await cloudinary.uploader.destroy(ImgId);
            }

            const newImage = await cloudinary.uploader.upload(req.body.image, {
                folder: 'products',
                width: 1200,
                crop: "scale"
            });

            data.image = {
                public_id: newImage.public_id,
                url: newImage.secure_url
            }

        }

        const productUpdate = await Product.findByIdAndUpdate(req.params.id, data, { new: true });

        res.status(200).json({
            success: true,
            productUpdate
        })

    } catch (error) {
        next(error);
    }

}




// exports.reorderProducts = async (req, res, next) => {
//     const { reorderedProducts } = req.body;

//     try {
//         // Update each product's order in the database
//         for (const [index, product] of reorderedProducts.entries()) {
//             await Product.findByIdAndUpdate(product._id, { order: index });
//         }

//         res.status(200).json({
//             success: true,
//             message: "Products reordered successfully!",
//         });
//     } catch (error) {
//         console.error(error);
//         next(error);
//     }
// };

// exports.reorderProducts = async (req, res) => {
//     const { reorderedProducts } = req.body;
  
//     try {
//       // Loop through the reordered products and update their 'order' field in the database
//       for (let i = 0; i < reorderedProducts.length; i++) {
//         await Product.findByIdAndUpdate(reorderedProducts[i], {
//           order: i, // Update the 'order' field with the new index
//         });
//       }
  
//       res.status(200).json({ message: "Product order updated successfully" });
//     } catch (err) {
//       console.error("Failed to reorder products", err);
//       res.status(500).json({ message: "Failed to reorder products" });
//     }
//   };
  
// exports.reorderProducts = async (req, res) => {
//     const { reorderedProducts } = req.body;

//     try {
//         // Using Promise.all for parallel updates
//         const updatePromises = reorderedProducts.map((productId, index) => 
//             Product.findByIdAndUpdate(productId, { order: index })
//         );

//         // Wait for all the update promises to resolve
//         await Promise.all(updatePromises);

//         res.status(200).json({ message: "Product order updated successfully" });
//     } catch (err) {
//         console.error("Failed to reorder products", err);
//         res.status(500).json({ message: "Failed to reorder products" });
//     }
// };

// exports.reorderProducts = async (req, res) => {
//     const { reorderedProducts } = req.body;

//     if (!reorderedProducts || reorderedProducts.length === 0) {
//         return res.status(400).json({ message: "No products to reorder" });
//     }

//     try {
//         const updatePromises = reorderedProducts.map((productId, index) => {
//             console.log(`Updating product with ID ${productId} to order ${index}`);
//             return Product.findByIdAndUpdate(productId, { order: index });
//         });

//         const updatedProducts = await Promise.all(updatePromises);

//         console.log("Updated products:", updatedProducts);
//         res.status(200).json({ message: "Product order updated successfully", products: updatedProducts });
//     } catch (err) {
//         console.error("Failed to reorder products", err);
//         res.status(500).json({ message: "Failed to reorder products", error: err.message });
//     }
// };

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
  