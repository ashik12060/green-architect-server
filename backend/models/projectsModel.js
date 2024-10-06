const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "title is required"],
        },
        content: {
            type: String,
            required: [true, "content is required"],
        },
        postedBy: {
            type: ObjectId,
            ref: "User",
        },
        image: {
            url: String,
            public_id: String,
        },
        
    },
    { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);