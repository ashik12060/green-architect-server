const cloudinary = require("../utils/cloudinary");
const Project = require("../models/projectsModel");
const ErrorResponse = require("../utils/errorResponse");
const main = require("../app");


exports.createProject = async (req, res, next) => {
  const {
    title,
    content,
    images,
    overviewImages,
    address,
    landArea,
    floors,
    frontRoad,
    units,
    parking,
    apartmentFloor,
    size,
    bedroom,
    bathroom,
    launchDate,
    collectionName,
    buildingType,
    mosque,
    college,
    school,
    market,
    bank1,
    bank2,
    atm,
    busStop,
    mosqueName,
    collegeName,
    schoolName,
    marketName,
    bank1Name,
    bank2Name,
    atmName,
    busStopName,
    category,
  } = req.body;

  if (
    !title ||
    !content ||
    !images ||
    !overviewImages ||
    !category ||
    !address ||
    !landArea ||
    !floors ||
    !frontRoad ||
    !units ||
    !parking ||
    !apartmentFloor ||
    !size ||
    !bedroom ||
    !bathroom ||
    !launchDate ||
    !collectionName ||
    !buildingType
  ) {
    return res.status(400).json({
      success: false,
      message: "All fields are required.",
    });
  }

  try {
    const validCategories = [
      "commercial",
      "healthcare",
      "residential",
      "religious",
      "landscape",
    ];
    const normalizedCategory = category.toLowerCase();

    if (!validCategories.includes(normalizedCategory)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category. Please select a valid category.",
      });
    }

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

    const uploadedOverviewImages = await Promise.all(
      overviewImages.map(async (overviewImage) => {
        const result = await cloudinary.uploader.upload(overviewImage, {
          folder: "projects overview",
          width: 1200,
          crop: "scale",
        });
        return { public_id: result.public_id, url: result.secure_url };
      })
    );

    const project = await Project.create({
      title,
      content,
      address,
      landArea,
      floors,
      frontRoad,
      units,
      parking,
      apartmentFloor,
      size,
      bedroom,
      bathroom,
      launchDate,
      collectionName,
      buildingType,
      mosque,
      college,
      school,
      market,
      bank1,
      bank2,
      atm,
      busStop,
      mosqueName,
      collegeName,
      schoolName,
      marketName,
      bank1Name,
      bank2Name,
      atmName,
      busStopName,
      category: normalizedCategory,
      postedBy: req.user._id,
      images: uploadedImages,
      overviewImages: uploadedOverviewImages, // Ensure this field is saved
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

exports.showSingleProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("postedBy", "name"); // Populating 'postedBy' field from User model
    
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
  try {
    const currentProject = await Project.findById(req.params.id);
    
    if (!currentProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Check if the image field exists before trying to delete it
    if (currentProject.image && currentProject.image.public_id) {
      await cloudinary.uploader.destroy(currentProject.image.public_id);
    }

    // Use findByIdAndDelete instead of findByIdAndRemove
    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};




// add multiple images

exports.updateProject = async (req, res, next) => {
  try {
    const { title, content, images, overviewImages, address, landArea, floors,frontRoad,units, parking, apartmentFloor, size, bedroom, bathroom, launchDate, collectionName, buildingType, mosque, college, school, market, bank1, bank2, atm, busStop, mosqueName, collegeName, schoolName, marketName, bank1Name, bank2Name, atmName, busStopName, category } = req.body;
    const currentProject = await Project.findById(req.params.id);

    // If the project does not exist
    if (!currentProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    // Return the existing project data for the frontend to populate the form
    res.status(200).json({
      success: true,
      project: currentProject,  // Send the entire current project data to the frontend
    });

    // Process updates if the fields are updated
    if (images && images.length) {
      await Promise.all(
        currentProject.images.map((img) =>
          cloudinary.uploader.destroy(img.public_id)
        )
      );

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

    if (overviewImages && overviewImages.length) {
      await Promise.all(
        currentProject.overviewImages.map((img) =>
          cloudinary.uploader.destroy(img.public_id)
        )
      );

      const uploadedOverviewImages = await Promise.all(
        overviewImages.map(async (image) => {
          const result = await cloudinary.uploader.upload(image, {
            folder: "projects overview",
            width: 1200,
            crop: "scale",
          });
          return { public_id: result.public_id, url: result.secure_url };
        })
      );

      currentProject.overviewImages = uploadedOverviewImages;
    }

    // Update other fields only if they are provided
    currentProject.title = title || currentProject.title;
    currentProject.content = content || currentProject.content;
    currentProject.address = address || currentProject.address;
    currentProject.landArea = landArea || currentProject.landArea;
    currentProject.floors = floors || currentProject.floors;
    currentProject.frontRoad = frontRoad || currentProject.frontRoad;
    currentProject.units = units || currentProject.units;
    currentProject.parking = parking || currentProject.parking;
    currentProject.apartmentFloor = apartmentFloor || currentProject.apartmentFloor;
    currentProject.size = size || currentProject.size;
    currentProject.bedroom = bedroom || currentProject.bedroom;
    currentProject.bathroom = bathroom || currentProject.bathroom;
    currentProject.launchDate = launchDate || currentProject.launchDate;
    currentProject.collectionName = collectionName || currentProject.collectionName;
    currentProject.buildingType = buildingType || currentProject.buildingType;
    currentProject.mosque = mosque || currentProject.mosque;
    currentProject.college = college || currentProject.college;
    currentProject.school = school || currentProject.school;
    currentProject.market = market || currentProject.market;
    currentProject.bank1 = bank1 || currentProject.bank1;
    currentProject.bank2 = bank2 || currentProject.bank2;
    currentProject.atm = atm || currentProject.atm;
    currentProject.busStop = busStop || currentProject.busStop;
    currentProject.mosqueName = mosqueName || currentProject.mosqueName;
    currentProject.collegeName = collegeName || currentProject.collegeName;
    currentProject.schoolName = schoolName || currentProject.schoolName;
    currentProject.marketName = marketName || currentProject.marketName;
    currentProject.bank1Name = bank1Name || currentProject.bank1Name;
    currentProject.bank2Name = bank2Name || currentProject.bank2Name;
    currentProject.atmName = atmName || currentProject.atmName;
    currentProject.busStopName = busStopName || currentProject.busStopName;
    currentProject.category = category || currentProject.category;

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
