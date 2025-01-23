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

// //show single post
// exports.showSinglePost = async (req, res, next) => {
//     try {
//         const post = await Post.findById(req.params.id).populate('comments.postedBy', 'name');
//         res.status(200).json({
//             success: true,
//             post
//         })
//     } catch (error) {
//         next(error);
//     }

// }


// //delete post

// exports.deletePost = async (req, res, next) => {
//     try {
//         const currentPost = await Post.findById(req.params.id);

//         if (!currentPost) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Post not found"
//             });
//         }

//         // Delete image from Cloudinary if exists
//         const ImgId = currentPost.image.public_id;
//         if (ImgId) {
//             try {
//                 const cloudinaryResponse = await cloudinary.uploader.destroy(ImgId);
//                 console.log("Cloudinary Response:", cloudinaryResponse);
//             } catch (cloudError) {
//                 console.error('Error deleting image from Cloudinary:', cloudError);
//                 return res.status(500).json({
//                     success: false,
//                     message: "Error deleting Post image from Cloudinary"
//                 });
//             }
//         }

//         // Delete the Post from the database
//         const post = await Post.findByIdAndDelete(req.params.id);
//         if (!post) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Post not found during delete operation"
//             });
//         }

//         res.status(200).json({
//             success: true,
//             message: "Post deleted"
//         });

//     } catch (error) {
//         console.error("Error deleting Post:", error);
//         next(error);
//     }
// };



// //update post
// exports.updatePost = async (req, res, next) => {
//     try {
//         const { title, content, image } = req.body;
//         const currentPost = await Post.findById(req.params.id);

//         //build the object data
//         const data = {
//             title: title || currentPost.title,
//             content: content || currentPost.content,
//             image: image || currentPost.image,
//         }

//         //modify post image conditionally
//         if (req.body.image !== '') {

//             const ImgId = currentPost.image.public_id;
//             if (ImgId) {
//                 await cloudinary.uploader.destroy(ImgId);
//             }

//             const newImage = await cloudinary.uploader.upload(req.body.image, {
//                 folder: 'posts',
//                 width: 1200,
//                 crop: "scale"
//             });

//             data.image = {
//                 public_id: newImage.public_id,
//                 url: newImage.secure_url
//             }

//         }

//         const postUpdate = await Post.findByIdAndUpdate(req.params.id, data, { new: true });

//         res.status(200).json({
//             success: true,
//             postUpdate
//         })

//     } catch (error) {
//         next(error);
//     }

// }

// //add comment
// exports.addComment = async (req, res, next) => {
//     const { comment } = req.body;
//     try {
//         const postComment = await Post.findByIdAndUpdate(req.params.id, {
//             $push: { comments: { text: comment, postedBy: req.user._id } }
//         },
//             { new: true }
//         );
//         const post = await Post.findById(postComment._id).populate('comments.postedBy', 'name email');
//         res.status(200).json({
//             success: true,
//             post
//         })

//     } catch (error) {
//         next(error);
//     }

// }


// // Add comment to a post
// exports.addComment = async (req, res, next) => {
//     const { comment } = req.body;
//     try {
//         const postComment = await Post.findByIdAndUpdate(
//             req.params.id,
//             {
//                 $push: { comments: { text: comment, postedBy: req.user._id } }
//             },
//             { new: true }
//         ).populate('comments.postedBy', 'name email');
//         res.status(200).json({
//             success: true,
//             post: postComment
//         });
//     } catch (error) {
//         next(error);
//     }
// };




// //add like
// exports.addLike = async (req, res, next) => {

//     try {
//         const post = await Post.findByIdAndUpdate(req.params.id, {
//             $addToSet: { likes: req.user._id }
//         },
//             { new: true }
//         );
//         const posts = await Post.find().sort({ createdAt: -1 }).populate('postedBy', 'name');
//         main.io.emit('add-like', posts);

//         res.status(200).json({
//             success: true,
//             post,
//             posts
//         })

//     } catch (error) {
//         next(error);
//     }

// }


// //remove like
// exports.removeLike = async (req, res, next) => {

//     try {
//         const post = await Post.findByIdAndUpdate(req.params.id, {
//             $pull: { likes: req.user._id }
//         },
//             { new: true }
//         );

//         const posts = await Post.find().sort({ createdAt: -1 }).populate('postedBy', 'name');
//         main.io.emit('remove-like', posts);

//         res.status(200).json({
//             success: true,
//             post
//         })

//     } catch (error) {
//         next(error);
//     }

// }

  