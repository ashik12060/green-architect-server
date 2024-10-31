const cloudinary = require('../utils/cloudinary');
const Project = require('../models/projectsModel');
const ErrorResponse = require('../utils/errorResponse');
const main = require('../app');

//create post
exports.createProject = async (req, res, next) => {
    const { title, content, postedBy, image} = req.body;

    try {
        //upload image in cloudinary
        const result = await cloudinary.uploader.upload(image, {
            folder: "projects",
            width: 1200,
            crop: "scale"
        })
        const project = await Project.create({
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
                url: result.secure_url
            },

        });
        res.status(201).json({
            success: true,
            project 
        })


    } catch (error) {
        console.log(error);
        next(error);
    }

}


//show Project 
exports.showProject = async (req, res, next) => {
    try {
        const projects = await Project .find().sort({ createdAt: -1 }).populate('postedBy', 'name');
        res.status(201).json({
            success: true,
            projects
        })
    } catch (error) {
        next(error);
    }

}


//show single Project 
exports.showSingleProject  = async (req, res, next) => {
    try {
        const project = await Project .findById(req.params.id).populate('comments.postedBy', 'name');
        res.status(200).json({
            success: true,
            project 
        })
    } catch (error) {
        next(error);
    }

}


//delete post
exports.deleteProject  = async (req, res, next) => {
    const currentProject  = await Project .findById(req.params.id);

    //delete post image in cloudinary       
    const ImgId = currentProject .image.public_id;
    if (ImgId) {
        await cloudinary.uploader.destroy(ImgId);
    }

    try {
        const project  = await Project .findByIdAndRemove(req.params.id);
        res.status(200).json({
            success: true,
            message: "Project  deleted"
        })

    } catch (error) {
        next(error);
    }

}


//update Project 
exports.updateProject  = async (req, res, next) => {
    try {
        const { title, content, image } = req.body;
        const currentProject  = await Project .findById(req.params.id);

        //build the object data
        const data = {
            title: title || currentProject .title,
            content: content || currentProject .content,
            image: image || currentProject .image,
        }

        //modify Project  image conditionally
        if (req.body.image !== '') {

            const ImgId = currentProject.image.public_id;
            if (ImgId) {
                await cloudinary.uploader.destroy(ImgId);
            }

            const newImage = await cloudinary.uploader.upload(req.body.image, {
                folder: 'projects ',
                width: 1200,
                crop: "scale"
            });

            data.image = {
                public_id: newImage.public_id,
                url: newImage.secure_url
            }

        }

        const projectsUpdate = await Project.findByIdAndUpdate(req.params.id, data, { new: true });

        res.status(200).json({
            success: true,
            projectsUpdate
        })

    } catch (error) {
        next(error);
    }

}

