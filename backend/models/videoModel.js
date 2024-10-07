const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const videoSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "title is required"],
        },
        thumbnail: {
            type: String,
            required: [true, "thumbnail is required"],
        },
        videoUrl: {
            type: String,
            required: [true, "videoUrl is required"],
        },
        postedBy: {
            type: ObjectId,
            ref: "User",
        },
        image: {
            url: String,
            public_id: String,
        },
       
    },
    { timestamps: true }
);

module.exports = mongoose.model('Video', videoSchema);