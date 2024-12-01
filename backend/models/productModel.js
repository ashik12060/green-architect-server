const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
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
        order: { type: Number, default: 0, required: true },

        
    },
    { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);