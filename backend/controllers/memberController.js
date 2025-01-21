const cloudinary = require('../utils/cloudinary');
const ErrorResponse = require('../utils/errorResponse');
const main = require('../app');
const Member = require('../models/memberModel');

exports.createMember = async (req, res, next) => {
    const { title, designation,article, image } = req.body;
  
    try {
      // Upload image to Cloudinary
      const result = await cloudinary.uploader.upload(image, {
        folder: "surgical",
        width: 1200,
        crop: "scale",
      });
  
      // Create a new member with multilingual fields for title and designation
      const member = await Member.create({
        title: {
          en: title.en,  // English title
          bn: title.bn,  // Bengali title
          es: title.es,  // Spanish title
        },
        designation: {
          en: designation.en,  // English designation
          bn: designation.bn,  // Bengali designation
          es: designation.es,  // Spanish designation
        },
        article: {
          en: article.en,  // English article
          bn: article.bn,  // Bengali article
          es: article.es,  // Spanish article
        },
        postedBy: req.user._id,
        image: {
          public_id: result.public_id,
          url: result.secure_url,
        },
      });
  
      res.status(201).json({
        success: true,
        member,
      });
    } catch (error) {
      console.error("Error adding member:", error);
      next(error);
    }
  };


exports.showMember = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
        const members = await Member.find()
            .sort({ createdAt: -1 })
            .populate('postedBy', 'name')
            .limit(limit)
            .skip((page - 1) * limit); // Pagination

        const count = await Member.countDocuments();

        res.status(200).json({
            success: true,
            total: count,
            page,
            members
        });
    } catch (error) {
        next(error);
    }
}


exports.showSingleMember = async (req, res, next) => {
    try {
        // Use member model 
        const member = await Member.findById(req.params.id); // No need to populate for simple fields
        if (!member) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        res.status(200).json({
            success: true,
            member, // Return member data directly
        });
    } catch (error) {
        next(error);
    }
}


exports.deleteMember = async (req, res, next) => {
    try {
        const currentMember = await Member.findById(req.params.id);

        if (!currentMember) {
            return res.status(404).json({
                success: false,
                message: "Member not found"
            });
        }

        // Delete image from Cloudinary if exists
        const ImgId = currentMember.image.public_id;
        if (ImgId) {
            try {
                const cloudinaryResponse = await cloudinary.uploader.destroy(ImgId);
                console.log("Cloudinary Response:", cloudinaryResponse);
            } catch (cloudError) {
                console.error('Error deleting image from Cloudinary:', cloudError);
                return res.status(500).json({
                    success: false,
                    message: "Error deleting Member image from Cloudinary"
                });
            }
        }

        // Delete the product from the database
        const member = await Member.findByIdAndDelete(req.params.id);
        if (!member) {
            return res.status(404).json({
                success: false,
                message: "Member not found during delete operation"
            });
        }

        res.status(200).json({
            success: true,
            message: "member deleted"
        });

    } catch (error) {
        console.error("Error deleting member:", error);
        next(error);
    }
};

// Update Member
exports.updateMember = async (req, res, next) => {
    const { title, designation,article, image } = req.body;  

    try {
        // Find the member by ID
        const member = await Member.findById(req.params.id);

        if (!member) {
            return res.status(404).json({
                success: false,
                message: 'member not found',
            });
        }

        // Upload new image to Cloudinary (if there's a new image)
        let imageResult = member.image; // keep existing image by default
        if (image) {
            const result = await cloudinary.uploader.upload(image, {
                folder: "surgical",
                width: 1200,
                crop: "scale"
            });
            imageResult = {
                public_id: result.public_id,
                url: result.secure_url
            };
        }

        // Update member fields
        member.title = {
            en: title.en || member.title.en,
            bn: title.bn || member.title.bn,
            es: title.es || member.title.es,
        };
        member.designation = {
            en: designation.en || member.designation.en,
            bn: designation.bn || member.designation.bn,
            es: designation.es || member.designation.es,
        };
        member.article = {
            en: article.en || member.article.en,
            bn: article.bn || member.article.bn,
            es: article.es || member.article.es,
        };
        member.image = imageResult;

        // Save updated product
        await member.save();

        res.status(200).json({
            success: true,
            member
        });
    } catch (error) {
        console.error('Error updating member:', error.message);
        next(error);
    }
};

