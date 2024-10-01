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
      title,
      content,
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
  const currentRnd = await Rnd.findById(req.params.id);

  //delete post image in cloudinary
  const ImgId = currentRnd.image.public_id;
  if (ImgId) {
    await cloudinary.uploader.destroy(ImgId);
  }

  try {
    const rnd = await Rnd.findByIdAndRemove(req.params.id);
    res.status(200).json({
      success: true,
      message: "Item deleted",
    });
  } catch (error) {
    next(error);
  }
};

// update 
exports.updateRnd = async (req, res, next) => {
  try {
    const {
      title,
      content,
      image,
    } = req.body;
    const currentRnd = await Rnd.findById(req.params.id);

    //build the object data
    const data = {
      title: title || currentRnd.title,
      content: content || currentRnd.content,
      image: image || currentRnd.image,
    };

    //modify rnd image conditionally
    if (req.body.image !== "") {
      const ImgId = currentRnd.image.public_id;
      if (ImgId) {
        await cloudinary.uploader.destroy(ImgId);
      }

      const newImage = await cloudinary.uploader.upload(req.body.image, {
        folder: "rnds",
        width: 1200,
        crop: "scale",
      });

      data.image = {
        public_id: newImage.public_id,
        url: newImage.secure_url,
      };
    }

    const rndUpdate = await Rnd.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });

    res.status(200).json({
      success: true,
      rndUpdate,
    });
  } catch (error) {
    next(error);
  }
};

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

