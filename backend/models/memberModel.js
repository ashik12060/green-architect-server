const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const memberSchema = new mongoose.Schema({
  title: {
    en: { type: String, required: true },
    bn: { type: String, required: true },
    es: { type: String, required: true },
  },
  designation: {
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
});

module.exports = mongoose.model("Member", memberSchema);
