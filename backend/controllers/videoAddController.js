const Video = require('../models/videoAddModel');
const ErrorResponse = require('../utils/errorResponse');
const main = require('../app');

//create video
exports.createVideo = async (req, res, next) => {
    const { title, videoUrl} = req.body;

    try {
     
        const video = await Video.create({
            title: {
                en: title.en,  // English title
                bn: title.bn,  // Bengali title
                es: title.es,  // Spanish title
              },
              videoUrl,
            
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



// Controller method to get all videos
exports.showVideos = async (req, res) => {
  try {
    const videos = await Video.find();
    res.json({ success: true, data: videos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// //show single video
exports.showSingleVideo = async (req, res, next) => {
   try {
           const video = await Video.findById(req.params.id); // No need to populate for simple fields
           if (!video) {
               return res.status(404).json({
                   success: false,
                   message: "video not found",
               });
           }
           res.status(200).json({
               success: true,
               video, // Return video data directly
           });
       } catch (error) {
           next(error);
       }

}


// //delete video

exports.deleteVideo = async (req, res, next) => {
    try {
        const currentVideo = await Video.findById(req.params.id);

        if (!currentVideo) {
            return res.status(404).json({
                success: false,
                message: "video not found"
            });
        }
        // Delete the video from the database
        const video = await Video.findByIdAndDelete(req.params.id);
        if (!video) {
            return res.status(404).json({
                success: false,
                message: "video not found during delete operation"
            });
        }

        res.status(200).json({
            success: true,
            message: "video deleted"
        });

    } catch (error) {
        console.error("Error deleting video:", error);
        next(error);
    }
};



// //update video
exports.updateVideo = async (req, res, next) => {
    try {
        const { title, videoUrl } = req.body;
        const currentVideo = await Video.findById(req.params.id);

        //build the object data
        const data = {
            title: title || currentVideo.title,
            videoUrl,
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
