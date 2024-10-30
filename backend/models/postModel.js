const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const postSchema = new mongoose.Schema(
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

module.exports = mongoose.model('Post', postSchema);