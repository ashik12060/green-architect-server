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
            title,
            content,

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

