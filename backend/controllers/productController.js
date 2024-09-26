const cloudinary = require("../utils/cloudinary");
const Product = require("../models/productModel");
const ErrorResponse = require("../utils/errorResponse");
const main = require("../app");


//create product
exports.createPostProduct = async (req, res, next) => {
  const {
    title,
    content,
    feature1,
    feature2,
    feature3,
    feature4,
    feature5,
    feature6,
    feature7,
    feature8,
    feature9,
    feature10,
    techSpec1,
    techSpec2,
    techSpec3,
    techSpec4,
    techSpec5,
    techSpec6,
    techSpec7,
    techSpec8,
    techSpec9,
    techSpec10,
    techSpec11,
    techSpec12,
    postedBy,
    image,
    likes,
    comments,
  } = req.body;

  try {
    //upload image in cloudinary
    const result = await cloudinary.uploader.upload(image, {
      folder: "products",
      width: 1200,
      crop: "scale",
    });

    const product = await Product.create({
      title,
      content,
      feature1,
      feature2,
      feature3,
      feature4,
      feature5,
      feature6,
      feature7,
      feature8,
      feature9,
      feature10,
      techSpec1,
      techSpec2,
      techSpec3,
      techSpec4,
      techSpec5,
      techSpec6,
      techSpec7,
      techSpec8,
      techSpec9,
      techSpec10,
      techSpec11,
      techSpec12,
      postedBy: req.user._id,
      image: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    });

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.showProduct = async (req, res, next) => {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .populate("postedBy", "name");
    res.status(201).json({
      success: true,
      products,
    });
  } catch (error) {
    next(error);
  }
};

exports.showSingleProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "comments.postedBy",
      "name"
    );
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

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
      message: "product deleted",
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const {
      title,
      content,
      feature1,
      feature2,
      feature3,
      feature4,
      feature5,
      feature6,
      feature7,
      feature8,
      feature9,
      feature10,
      techSpec1,
      techSpec2,
      techSpec3,
      techSpec4,
      techSpec5,
      techSpec6,
      techSpec7,
      techSpec8,
      techSpec9,
      techSpec10,
      techSpec11,
      techSpec12,
      image,
    } = req.body;
    const currentProduct = await Product.findById(req.params.id);

    //build the object data
    const data = {
      title: title || currentProduct.title,
      content: content || currentProduct.content,
      // content: feature1 || currentProduct.feature1,
      feature1: feature1 || currentProduct.feature1,
      feature2: feature2 || currentProduct.feature2,
      feature3: feature3 || currentProduct.feature3,
      feature4: feature4 || currentProduct.feature4,
      feature5: feature5 || currentProduct.feature5,
      feature6: feature6 || currentProduct.feature6,
      feature7: feature7 || currentProduct.feature7,
      feature8: feature8 || currentProduct.feature8,
      feature9: feature9 || currentProduct.feature9,
      feature10: feature10 || currentProduct.feature10,
      techSpec1: techSpec1 || currentProduct.techSpec1,
      techSpec2: techSpec2 || currentProduct.techSpec2,
      techSpec3: techSpec3 || currentProduct.techSpec3,
      techSpec4: techSpec4 || currentProduct.techSpec4,
      techSpec5: techSpec5 || currentProduct.techSpec5,
      techSpec6: techSpec6 || currentProduct.techSpec6,
      techSpec7: techSpec7 || currentProduct.techSpec7,
      techSpec8: techSpec8 || currentProduct.techSpec8,
      techSpec9: techSpec9 || currentProduct.techSpec9,
      techSpec10: techSpec10 || currentProduct.techSpec10,
      techSpec11: techSpec11 || currentProduct.techSpec11,
      techSpec12: techSpec12 || currentProduct.techSpec12,
      image: image || currentProduct.image,
    };

    //modify product image conditionally
    if (req.body.image !== "") {
      const ImgId = currentProduct.image.public_id;
      if (ImgId) {
        await cloudinary.uploader.destroy(ImgId);
      }

      const newImage = await cloudinary.uploader.upload(req.body.image, {
        folder: "products",
        width: 1200,
        crop: "scale",
      });

      data.image = {
        public_id: newImage.public_id,
        url: newImage.secure_url,
      };
    }

    const productUpdate = await Product.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });

    res.status(200).json({
      success: true,
      productUpdate,
    });
  } catch (error) {
    next(error);
  }
};

exports.addComment = async (req, res, next) => {
  const { comment } = req.body;
  try {
    const productComment = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $push: { comments: { text: comment, postedBy: req.user._id } },
      },
      { new: true }
    );
    const product = await Product.findById(productComment._id).populate(
      "comments.postedBy",
      "name email"
    );
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

exports.addLike = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { likes: req.user._id },
      },
      { new: true }
    );
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .populate("postedBy", "name");
    main.io.emit("add-like", products);

    res.status(200).json({
      success: true,
      product,
      products,
    });
  } catch (error) {
    next(error);
  }
};

exports.removeLike = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { likes: req.user._id },
      },
      { new: true }
    );

    const products = await Product.find()
      .sort({ createdAt: -1 })
      .populate("postedBy", "name");
    main.io.emit("remove-like", products);

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

