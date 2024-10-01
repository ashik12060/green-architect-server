const cloudinary = require('../utils/cloudinary');
const ErrorResponse = require('../utils/errorResponse');
const main = require('../app');
const Member = require('../models/memberModel');

//create item
exports.createMember = async (req, res, next) => {
    const { title, designation, postedBy, image, likes, comments } = req.body;

    try {
        //upload image in cloudinary
        const result = await cloudinary.uploader.upload(image, {
            folder: "surgical",
            width: 1200,
            crop: "scale"
        })
        const member = await Member.create({
            title,
            designation,

            postedBy: req.user._id,
            image: {
                public_id: result.public_id,
                url: result.secure_url
            },

        });
        res.status(201).json({
            success: true,
            member
        })


    } catch (error) {
        console.log(error);
        next(error);
    }

}


//show Members
exports.showMember = async (req, res, next) => {
    try {
        const members = await Member.find().sort({ createdAt: -1 }).populate('postedBy', 'name');
        res.status(201).json({
            success: true,
            members
        })
    } catch (error) {
        next(error);
    }

}


//show single member
exports.showSingleMember = async (req, res, next) => {
    try {
        const members = await Members.findById(req.params.id).populate('comments.postedBy', 'name');
        res.status(200).json({
            success: true,
            members
        })
    } catch (error) {
        next(error);
    }

}


//delete item
exports.deleteMember = async (req, res, next) => {
    const currentMember = await Member.findById(req.params.id);

    //delete member image in cloudinary       
    const ImgId = currentMember.image.public_id;
    if (ImgId) {
        await cloudinary.uploader.destroy(ImgId);
    }

    try {
        const member = await Member.findByIdAndRemove(req.params.id);
        res.status(200).json({
            success: true,
            message: "Image deleted"
        })

    } catch (error) {
        next(error);
    }

}


//update member
exports.updateMember = async (req, res, next) => {
    try {
        const { title, designation, image } = req.body;
        const currentMember = await Member.findById(req.params.id);

        //build the object data
        const data = {
            title: title || currentMember.title,
            designation: designation || currentMember.designation,
            image: image || currentMember.image,
        }

        //modify member image conditionally
        if (req.body.image !== '') {

            const ImgId = currentMember.image.public_id;
            if (ImgId) {
                await cloudinary.uploader.destroy(ImgId);
            }

            const newImage = await cloudinary.uploader.upload(req.body.image, {
                folder: 'Member',
                width: 1200,
                crop: "scale"
            });

            data.image = {
                public_id: newImage.public_id,
                url: newImage.secure_url
            }

        }

        const memberUpdate = await Member.findByIdAndUpdate(req.params.id, data, { new: true });

        res.status(200).json({
            success: true,
            memberUpdate
        })

    } catch (error) {
        next(error);
    }

}

  