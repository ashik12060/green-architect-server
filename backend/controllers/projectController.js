const cloudinary = require("../utils/cloudinary");
const Project = require("../models/projectsModel");
const ErrorResponse = require("../utils/errorResponse");
const main = require("../app");



exports.createProject = async (req, res, next) => {
  const {
    title,
    content,
    images,
    address,
    landArea,
    floors,
    apartmentFloor,
    size,
    bedroom,
    bathroom,
    launchDate,
    collectionName,
    buildingType,
    category,
  } = req.body;

  // Validate required fields
  if (!title || !content || !images || !category || !address || !landArea ||!floors ||!apartmentFloor ||!size ||!bedroom ||!bathroom ||!launchDate ||!collectionName || !buildingType) {
    return res.status(400).json({
      success: false,
      message: "All fields  are required.",
    });
  }

  try {
    // Normalize category (in case the frontend sends mixed case)
    const validCategories = [
      "web-development",
      "design",
      "marketing",
      "data-science",
      "other",
    ];
    const normalizedCategory = category.toLowerCase();

    // Validate category
    if (!validCategories.includes(normalizedCategory)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category. Please select a valid category.",
      });
    }

    // Upload images to Cloudinary
    const uploadedImages = await Promise.all(
      images.map(async (image) => {
        const result = await cloudinary.uploader.upload(image, {
          folder: "projects",
          width: 1200,
          crop: "scale",
        });
        return { public_id: result.public_id, url: result.secure_url };
      })
    );

    // Create project in the database
    const project = await Project.create({
      title,
      content,
      address,
      landArea,
      floors,
      apartmentFloor,
      size,
      bedroom,
      bathroom,
      launchDate,
      collectionName,
      buildingType,
      category: normalizedCategory, // Use normalized category
      postedBy: req.user._id, // Assuming user info is in req.user
      images: uploadedImages,
    });

    res.status(201).json({
      success: true,
      project,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the project.",
    });
    next(error);
  }
};

exports.showProject = async (req, res, next) => {
  const { category } = req.query;

  try {
    const query = category ? { category } : {}; // Filter by category if provided
    const projects = await Project.find(query)
      .sort({ createdAt: -1 })
      .populate("postedBy", "name");

    res.status(200).json({
      success: true,
      projects,
    });
  } catch (error) {
    next(error);
  }
};

//show single Project
exports.showSingleProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      "comments.postedBy",
      "name"
    );
    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    next(error);
  }
};

//delete post
exports.deleteProject = async (req, res, next) => {
  const currentProject = await Project.findById(req.params.id);

  //delete post image in cloudinary
  const ImgId = currentProject.image.public_id;
  if (ImgId) {
    await cloudinary.uploader.destroy(ImgId);
  }

  try {
    const project = await Project.findByIdAndRemove(req.params.id);
    res.status(200).json({
      success: true,
      message: "Project  deleted",
    });
  } catch (error) {
    next(error);
  }
};

// add multiple images
exports.updateProject = async (req, res, next) => {
  try {
    const { title, content, images } = req.body;
    const currentProject = await Project.findById(req.params.id);

    // Delete old images if a new set of images is provided
    if (images && images.length) {
      await Promise.all(
        currentProject.images.map((img) =>
          cloudinary.uploader.destroy(img.public_id)
        )
      );

      // Upload new images to Cloudinary
      const uploadedImages = await Promise.all(
        images.map(async (image) => {
          const result = await cloudinary.uploader.upload(image, {
            folder: "projects",
            width: 1200,
            crop: "scale",
          });
          return { public_id: result.public_id, url: result.secure_url };
        })
      );

      currentProject.images = uploadedImages;
    }

    currentProject.title = title || currentProject.title;
    currentProject.content = content || currentProject.content;
    const projectsUpdate = await currentProject.save();

    res.status(200).json({
      success: true,
      projectsUpdate,
    });
  } catch (error) {
    next(error);
  }
};




exports.reorderProjects = async (req, res) => {
  const { reorderedProjects } = req.body;

  try {
    // Ensure projects are updated with the new order
    for (let i = 0; i < reorderedProjects.length; i++) {
      await Project.findByIdAndUpdate(reorderedProjects[i], {
        order: i, // Update the 'order' field with the new index
      });
    }

    res.status(200).json({ message: "Order updated successfully" });
  } catch (err) {
    console.error("Failed to reorder projects", err);
    res.status(500).json({ message: "Failed to reorder projects" });
  }
};
