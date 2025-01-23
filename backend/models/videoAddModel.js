const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const videoSchema = new mongoose.Schema(
  {
    title: {
      en: { type: String, required: true },
      bn: { type: String, required: true },
      es: { type: String, required: true },
    },
    videoUrl: {
      type: String,
      required: true,
    },

    postedBy: {
      type: ObjectId,
      ref: "User",
    },
    
   
  },
  { timestamps: true }
);

module.exports = mongoose.model("Video", videoSchema);
