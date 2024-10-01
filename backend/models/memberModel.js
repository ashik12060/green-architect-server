const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const memberSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "title is required"],
        },
        designation: {
            type: String,
            required: [true, "designation is required"],
        },
        postedBy: {
            type: ObjectId,
            ref: "User",
        },
        image: {
            url: String,
            public_id: String,
        },
        // likes: [{ type: ObjectId, ref: "User" }],
        // comments: [
        //     {
        //         text: String,
        //         created: { type: Date, default: Date.now },
        //         postedBy: {
        //             type: ObjectId,
        //             ref: "User",
        //         },
        //     },
        // ],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Member', memberSchema);