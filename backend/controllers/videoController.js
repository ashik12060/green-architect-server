const cloudinary = require('../utils/cloudinary');
const ErrorResponse = require('../utils/errorResponse');
const main = require('../app');
const Video = require('../models/videoModel');

//create item
exports.createVideo = async (req, res, next) => {
    const { title, thumbnail, videoUrl, image } = req.body;

    try {
        //upload image in cloudinary
        const result = await cloudinary.uploader.upload(image, {
            folder: "video",
            width: 1200,
            crop: "scale"
        })
        const video = await Video.create({
            title: {
                en: title.en,  // English title
                bn: title.bn,  // Bengali title
                es: title.es,  // Danish title
              },
            thumbnail,
            videoUrl,
            postedBy: req.user._id,
            image: {
                public_id: result.public_id,
                url: result.secure_url
            },

        });
        res.status(201).json({
            success: true,
            video
        })


    } catch (error) {
        console.log(error);
        next(error);
    }

}


//show  videos
exports.showVideo = async (req, res, next) => {
    try {
        const videos = await Video.find().sort({ createdAt: -1 }).populate('postedBy', 'name');
        res.status(201).json({
            success: true,
            videos
        })
    } catch (error) {
        next(error);
    }

}


//show single  video
exports.showSingleVideo = async (req, res, next) => {
    try {
        const videos = await Video.findById(req.params.id).populate('comments.postedBy', 'name');
        res.status(200).json({
            success: true,
            videos
        })
    } catch (error) {
        next(error);
    }

}


//delete item
exports.deleteVideo = async (req, res, next) => {
    const currentVideo = await Video.findById(req.params.id);

    //delete  video image in cloudinary       
    const ImgId = currentVideo.image.public_id;
    if (ImgId) {
        await cloudinary.uploader.destroy(ImgId);
    }

    try {
        const video = await Video.findByIdAndRemove(req.params.id);
        res.status(200).json({
            success: true,
            message: "Video deleted"
        })

    } catch (error) {
        next(error);
    }

}


//update Video
exports.updateVideo = async (req, res, next) => {
    try {
        const { title, thumbnail,videoUrl, image } = req.body;
        const currentVideo = await Video.findById(req.params.id);

        //build the object data
        const data = {
            title: title || currentVideo.title,
            thumbnail: thumbnail || currentVideo.thumbnail,
            videoUrl: videoUrl || currentVideo.videoUrl,
            image: image || currentVideo.image,
        }

        //modify video image conditionally
        if (req.body.image !== '') {

            const ImgId = currentVideo.image.public_id;
            if (ImgId) {
                await cloudinary.uploader.destroy(ImgId);
            }

            const newImage = await cloudinary.uploader.upload(req.body.image, {
                folder: 'video',
                width: 1200,
                crop: "scale"
            });

            data.image = {
                public_id: newImage.public_id,
                url: newImage.secure_url
            }

        }

        const videoUpdate = await Video.findByIdAndUpdate(req.params.id, data, { new: true });

        res.status(200).json({
            success: true,
            videoUpdate
        })

    } catch (error) {
        next(error);
    }

}

  