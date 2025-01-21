const cloudinary = require('../utils/cloudinary');
const ErrorResponse = require('../utils/errorResponse');
const main = require('../app');
const Carousel = require('../models/carouselModel');

//create item
exports.createCarousel = async (req, res, next) => {
    const { title, postedBy, image} = req.body;

    try {
        //upload image in cloudinary
        const result = await cloudinary.uploader.upload(image, {
            folder: "carousel",
            width: 1200,
            crop: "scale"
        })
        const carousel = await Carousel.create({
            title: {
                en: title.en,  // English title
                bn: title.bn,  // Bengali title
                es: title.es,  // Spanish title
              },
              postedBy: req.user._id,
            image: {
                public_id: result.public_id,
                url: result.secure_url
            },

        });
        res.status(201).json({
            success: true,
            carousel
        })


    } catch (error) {
        console.log(error);
        next(error);
    }

}


//show items
exports.showCarousel = async (req, res, next) => {
    try {
        const carousels = await Carousel.find().sort({ createdAt: -1 }).populate('postedBy', 'name');
        res.status(201).json({
            success: true,
            carousels
        })
    } catch (error) {
        next(error);
    }

}

exports.showSingleCarousel = async (req, res, next) => {
    try {
        // Use Product model instead of Post
        const carousel = await Carousel.findById(req.params.id); // No need to populate for simple fields
        if (!carousel) {
            return res.status(404).json({
                success: false,
                message: "carousel not found",
            });
        }
        res.status(200).json({
            success: true,
            carousel, // Return carousel data directly
        });
    } catch (error) {
        next(error);
    }
}




//delete item
// exports.deleteCarousel = async (req, res, next) => {
//     const currentCarousel = await Carousel.findById(req.params.id);

//     //delete item image in cloudinary       
//     const ImgId = currentCarousel.image.public_id;
//     if (ImgId) {
//         await cloudinary.uploader.destroy(ImgId);
//     }

//     try {
//         const carousel = await Carousel.findByIdAndRemove(req.params.id);
//         res.status(200).json({
//             success: true,
//             message: "Carousel deleted"
//         })

//     } catch (error) {
//         next(error);
//     }

// }

exports.deleteCarousel = async (req, res, next) => {
    try {
        const currentCarousel = await Carousel.findById(req.params.id);

        if (!currentCarousel) {
            return res.status(404).json({
                success: false,
                message: "Carousel not found"
            });
        }

        // Delete image from Cloudinary if exists
        const ImgId = currentCarousel.image.public_id;
        if (ImgId) {
            try {
                const cloudinaryResponse = await cloudinary.uploader.destroy(ImgId);
                console.log("Cloudinary Response:", cloudinaryResponse);
            } catch (cloudError) {
                console.error('Error deleting image from Cloudinary:', cloudError);
                return res.status(500).json({
                    success: false,
                    message: "Error deleting Carousel image from Cloudinary"
                });
            }
        }

        // Delete the Carousel from the database
        const carousel = await Carousel.findByIdAndDelete(req.params.id);
        if (!carousel) {
            return res.status(404).json({
                success: false,
                message: "Carousel not found during delete operation"
            });
        }

        res.status(200).json({
            success: true,
            message: "Carousel deleted"
        });

    } catch (error) {
        console.error("Error deleting Carousel:", error);
        next(error);
    }
};


//update item
exports.updateCarousel = async (req, res, next) => {
    try {
        const { title, image } = req.body;
        const currentCarousel = await Carousel.findById(req.params.id);

        //build the object data
        const data = {
            title: title || currentCarousel.title,            
            image: image || currentCarousel.image,
        }

        //modify item image conditionally
        if (req.body.image !== '') {

            const ImgId = currentCarousel.image.public_id;
            if (ImgId) {
                await cloudinary.uploader.destroy(ImgId);
            }

            const newImage = await cloudinary.uploader.upload(req.body.image, {
                folder: 'carousel',
                width: 1200,
                crop: "scale"
            });

            data.image = {
                public_id: newImage.public_id,
                url: newImage.secure_url
            }

        }

        const carouselUpdate = await Carousel.findByIdAndUpdate(req.params.id, data, { new: true });

        res.status(200).json({
            success: true,
            carouselUpdate
        })

    } catch (error) {
        next(error);
    }

}

  