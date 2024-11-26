// third
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const projectSchema = new mongoose.Schema(
    {
        title: {
            en: { type: String, required: true },
            bn: { type: String, required: true },
            es: { type: String, required: true },
        },
        content: {
            en: { type: String, required: true },
            bn: { type: String, required: true },
            es: { type: String, required: true },
        },
        address: {
            en: { type: String, required: true },
            bn: { type: String, required: true },
            es: { type: String, required: true },
        },
        landArea: {
            en: { type: String, required: true },
            bn: { type: String, required: true },
            es: { type: String, required: true },
        },
        floors: {
            en: { type: String, required: true },
            bn: { type: String, required: true },
            es: { type: String, required: true },
        },
        apartmentFloor: {
            en: { type: String, required: true },
            bn: { type: String, required: true },
            es: { type: String, required: true },
        },
        size: {
            en: { type: String, required: true },
            bn: { type: String, required: true },
            es: { type: String, required: true },
        },
        bedroom: {
            en: { type: String, required: true },
            bn: { type: String, required: true },
            es: { type: String, required: true },
        },
        bathroom: {
            en: { type: String, required: true },
            bn: { type: String, required: true },
            es: { type: String, required: true },
        },
        launchDate: {
            en: { type: String, required: true },
            bn: { type: String, required: true },
            es: { type: String, required: true },
        },
        collectionName: {
            en: { type: String, required: true },
            bn: { type: String, required: true },
            es: { type: String, required: true },
        },
       
        buildingType: {
            en: { type: String, required: true },
            bn: { type: String, required: true },
            es: { type: String, required: true },
        },
        category: { 
            type: String, 
            required: true, 
            enum: ['web-development', 'design', 'marketing', 'data-science', 'other'], // Predefined categories (using lowercase for consistency)
        },
        postedBy: {
            type: ObjectId,
            ref: "User",
        },
        images: [{
            url: String,
            public_id: String,
        }],
        order: { type: Number, default: 0 },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
