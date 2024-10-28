const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const carouselSchema = new mongoose.Schema(
    {
        title: {
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
       
    },
    { timestamps: true }
);

module.exports = mongoose.model('Carousel', carouselSchema);