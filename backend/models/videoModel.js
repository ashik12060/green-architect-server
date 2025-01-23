// const mongoose = require('mongoose');
// const { ObjectId } = mongoose.Schema;

// const videoSchema = new mongoose.Schema(
//     {
//         title: {
//             en: { type: String, required: true },
//             bn: { type: String, required: true },
//             es: { type: String, required: true },
//           },
//         thumbnail: {
//             type: String,
//             required: [true, "thumbnail is required"],
//         },
//         videoUrl: {
//             type: String,
//             required: [true, "videoUrl is required"],
//         },
//         postedBy: {
//             type: ObjectId,
//             ref: "User",
//         },
//         image: {
//             url: String,
//             public_id: String,
//         },
       
//     },
//     { timestamps: true }
// );

// module.exports = mongoose.model('Video', videoSchema);