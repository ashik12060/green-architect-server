const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "title is required"],
        },
        content: {
            type: String,
            required: [true, "content is required"],
        },
        // features start
        feature1: {
            type: String,
            required: [false, "feature1 is required"],
        },
        feature2: {
            type: String,
            required: [false, "feature2 is required"],
        },
        feature3: {
            type: String,
            required: [false, "feature3 is required"],
        },
        feature4: {
            type: String,
            required: [false, "feature4 is required"],
        },
        feature5: {
            type: String,
            required: [false, "feature5 is required"],
        },
        feature6: {
            type: String,
            required: [false, "feature6 is required"],
        },
        feature7: {
            type: String,
            required: [false, "feature7 is required"],
        },
        feature8: {
            type: String,
            required: [false, "feature8 is required"],
        },
        feature9: {
            type: String,
            required: [false, "feature9 is required"],
        },
        feature10: {
            type: String,
            required: [false, "feature10 is required"],
        },

        // technical specification
        techSpec1: {
            type: String,
            required: [false, "techSpec1 is required"],
        },
        techSpec2: {
            type: String,
            required: [false, "techSpec2 is required"],
        },
        techSpec3: {
            type: String,
            required: [false, "techSpec3 is required"],
        },
        techSpec4: {
            type: String,
            required: [false, "techSpec4 is required"],
        },
        techSpec5: {
            type: String,
            required: [false, "techSpec5 is required"],
        },
        techSpec6: {
            type: String,
            required: [false, "techSpec6 is required"],
        },
        techSpec7: {
            type: String,
            required: [false, "techSpec7 is required"],
        },
        techSpec8: {
            type: String,
            required: [false, "techSpec8 is required"],
        },
        techSpec9: {
            type: String,
            required: [false, "techSpec9 is required"],
        },
        techSpec10: {
            type: String,
            required: [false, "techSpec10 is required"],
        },
        techSpec11: {
            type: String,
            required: [false, "techSpec11 is required"],
        },
        techSpec12: {
            type: String,
            required: [false, "techSpec12 is required"],
        },


        postedBy: {
            type: ObjectId,
            ref: "User",
        },
        image: {
            url: String,
            public_id: String,
        },
        likes: [{ type: ObjectId, ref: "User" }],
        comments: [
            {
                text: String,
                created: { type: Date, default: Date.now },
                postedBy: {
                    type: ObjectId,
                    ref: "User",
                },
            },
        ],

        
    },
    { timestamps: true }

    
);



module.exports = mongoose.model('Product', productSchema);

