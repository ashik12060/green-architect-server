const cloudinary = require("../utils/cloudinary");
const Rnd = require("../models/rndModel");
const ErrorResponse = require("../utils/errorResponse");
const main = require("../app");


//create rnd
exports.createRnd = async (req, res, next) => {
  const {
    title,
    content,
    postedBy,
    image,
    likes,
    comments,
  } = req.body;

  try {
    //upload image in cloudinary
    const result = await cloudinary.uploader.upload(image, {
      folder: "rnd",
      width: 1200,
      crop: "scale",
    });

    const rnd = await Rnd.create({
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
        url: result.secure_url,
      },
    });

    res.status(201).json({
      success: true,
      rnd,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.showRnd = async (req, res, next) => {
  try {
    const rnds = await Rnd.find()
      .sort({ createdAt: -1 })
      .populate("postedBy", "name");
    res.status(201).json({
      success: true,
      rnds,
    });
  } catch (error) {
    next(error);
  }
};

exports.showSingleRnd = async (req, res, next) => {
  try {
    const rnd = await Rnd.findById(req.params.id).populate(
      "comments.postedBy",
      "name"
    );
    res.status(200).json({
      success: true,
      rnd,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteRnd = async (req, res, next) => {
    try {
        const currentRnd = await Rnd.findById(req.params.id);

        if (!currentRnd) {
            return res.status(404).json({
                success: false,
                message: "Rnd not found"
            });
        }

        // Delete image from Cloudinary if exists
        const ImgId = currentRnd.image.public_id;
        if (ImgId) {
            try {
                const cloudinaryResponse = await cloudinary.uploader.destroy(ImgId);
                console.log("Cloudinary Response:", cloudinaryResponse);
            } catch (cloudError) {
                console.error('Error deleting image from Cloudinary:', cloudError);
                return res.status(500).json({
                    success: false,
                    message: "Error deleting Rnd image from Cloudinary"
                });
            }
        }

        // Delete the Rnd from the database
        const rnd = await Rnd.findByIdAndDelete(req.params.id);
        if (!rnd) {
            return res.status(404).json({
                success: false,
                message: "Rnd not found during delete operation"
            });
        }

        res.status(200).json({
            success: true,
            message: "Rnd deleted"
        });

    } catch (error) {
        console.error("Error deleting Rnd:", error);
        next(error);
    }
};


exports.updateRnd = async (req, res, next) => {
    const { title, content, image } = req.body;  // Assuming title and content can be updated

    try {
        // Find the product by ID
        const rnd = await Rnd.findById(req.params.id);

        if (!rnd) {
            return res.status(404).json({
                success: false,
                message: 'Rnd not found',
            });
        }

        // Upload new image to Cloudinary (if there's a new image)
        let imageResult = rnd.image; // keep existing image by default
        if (image) {
            const result = await cloudinary.uploader.upload(image, {
                folder: "rnd",
                width: 1200,
                crop: "scale"
            });
            imageResult = {
                public_id: result.public_id,
                url: result.secure_url
            };
        }

        // Update rnd fields
        rnd.title = {
            en: title.en || rnd.title.en,
            bn: title.bn || rnd.title.bn,
            es: title.es || rnd.title.es,
        };
        rnd.content = {
            en: content.en || rnd.content.en,
            bn: content.bn || rnd.content.bn,
            es: content.es || rnd.content.es,
        };
        rnd.image = imageResult;

        // Save updated rnd
        await rnd.save();

        res.status(200).json({
            success: true,
            rnd
        });
    } catch (error) {
        console.error('Error updating rnd:', error.message);
        next(error);
    }
};


// update 
// exports.updateRnd = async (req, res, next) => {
//   try {
//     const {
//       title,
//       content,
//       image,
//     } = req.body;
//     const currentRnd = await Rnd.findById(req.params.id);

//     //build the object data
//     const data = {
//       title: title || currentRnd.title,
//       content: content || currentRnd.content,
//       image: image || currentRnd.image,
//     };

//     //modify rnd image conditionally
//     if (req.body.image !== "") {
//       const ImgId = currentRnd.image.public_id;
//       if (ImgId) {
//         await cloudinary.uploader.destroy(ImgId);
//       }

//       const newImage = await cloudinary.uploader.upload(req.body.image, {
//         folder: "rnds",
//         width: 1200,
//         crop: "scale",
//       });

//       data.image = {
//         public_id: newImage.public_id,
//         url: newImage.secure_url,
//       };
//     }

//     const rndUpdate = await Rnd.findByIdAndUpdate(req.params.id, data, {
//       new: true,
//     });

//     res.status(200).json({
//       success: true,
//       rndUpdate,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// add comment
exports.addComment = async (req, res, next) => {
  const { comment } = req.body;
  try {
    const rndComment = await Rnd.findByIdAndUpdate(
      req.params.id,
      {
        $push: { comments: { text: comment, postedBy: req.user._id } },
      },
      { new: true }
    );
    const rnd = await Rnd.findById(rndComment._id).populate(
      "comments.postedBy",
      "name email"
    );
    res.status(200).json({
      success: true,
      rnd,
    });
  } catch (error) {
    next(error);
  }
};

exports.addLike = async (req, res, next) => {
  try {
    const rnd = await Rnd.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { likes: req.user._id },
      },
      { new: true }
    );
    const rnds = await Rnd.find()
      .sort({ createdAt: -1 })
      .populate("postedBy", "name");
    main.io.emit("add-like", rnds);

    res.status(200).json({
      success: true,
      rnd,
      rnds,
    });
  } catch (error) {
    next(error);
  }
};

exports.removeLike = async (req, res, next) => {
  try {
    const rnd = await Rnd.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { likes: req.user._id },
      },
      { new: true }
    );

    const rnds = await Rnd.find()
      .sort({ createdAt: -1 })
      .populate("postedBy", "name");
    main.io.emit("remove-like", rnds);

    res.status(200).json({
      success: true,
      rnd,
    });
  } catch (error) {
    next(error);
  }
};

