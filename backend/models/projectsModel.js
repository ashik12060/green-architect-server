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

    //    new

        mosque: {
            en: { type: String, required: true },
            bn: { type: String, required: true },
            es: { type: String, required: true },
        },
       
        college: {
            en: { type: String, required: true },
            bn: { type: String, required: true },
            es: { type: String, required: true },
        },
       
        school: {
            en: { type: String, required: true },
            bn: { type: String, required: true },
            es: { type: String, required: true },
        },
       
        market: {
            en: { type: String, required: true },
            bn: { type: String, required: true },
            es: { type: String, required: true },
        },
       
        bank1: {
            en: { type: String, required: true },
            bn: { type: String, required: true },
            es: { type: String, required: true },
        },
       
        bank2: {
            en: { type: String, required: true },
            bn: { type: String, required: true },
            es: { type: String, required: true },
        },
       
        atm: {
            en: { type: String, required: true },
            bn: { type: String, required: true },
            es: { type: String, required: true },
        },
       
        busStop: {
            en: { type: String, required: true },
            bn: { type: String, required: true },
            es: { type: String, required: true },
        },
        // start
        
        mosqueName: {
            en: { type: String, required: true },
            bn: { type: String, required: true },
            es: { type: String, required: true },
        },
       
        collegeName: {
            en: { type: String, required: true },
            bn: { type: String, required: true },
            es: { type: String, required: true },
        },
       
        schoolName: {
            en: { type: String, required: true },
            bn: { type: String, required: true },
            es: { type: String, required: true },
        },
       
        marketName: {
            en: { type: String, required: true },
            bn: { type: String, required: true },
            es: { type: String, required: true },
        },
       
        bank1Name: {
            en: { type: String, required: true },
            bn: { type: String, required: true },
            es: { type: String, required: true },
        },
       
        bank2Name: {
            en: { type: String, required: true },
            bn: { type: String, required: true },
            es: { type: String, required: true },
        },
       
        atmName: {
            en: { type: String, required: true },
            bn: { type: String, required: true },
            es: { type: String, required: true },
        },
       
        busStopName: {
            en: { type: String, required: true },
            bn: { type: String, required: true },
            es: { type: String, required: true },
        },




        category: { 
            type: String, 
            required: true, 
            // enum: ['COMMERCIAL', 'HEALTHCARE', 'RESIDENTIAL', 'RELIGIOUS', 'LANDSCAPE'], // Predefined categories (using lowercase for consistency)
            enum: ['commercial', 'healthcare', 'residential', 'religious', 'landscape'], // Predefined categories (using lowercase for consistency)
        },
        // <option value="web-development">COMMERCIAL 
        // </option>
        // <option value="design">HEALTHCARE</option>
        // <option value="marketing">RESIDENTIAL</option>
        // <option value="design">RELIGIOUS</option>
        // <option value="marketing">LANDSCAPE</option>
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
