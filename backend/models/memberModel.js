const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

// const memberSchema = new mongoose.Schema(
//     {
//         title: {
//             type: String,
//             required: [true, "title is required"],
//         },
//         designation: {
//             type: String,
//             required: [true, "designation is required"],
//         },
//         postedBy: {
//             type: ObjectId,
//             ref: "User",
//             required: true, // Ensure this is required
//         },
//         image: {
//             url: { type: String, required: true },
//             public_id: { type: String, required: true },
//         },
//     },
//     { timestamps: true }
// );

// module.exports = mongoose.model('Member', memberSchema);

// models/Member.js

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

// const memberSchema = new mongoose.Schema(
//     {
//         title: {
//             type: String,
//             required: [true, "title is required"],
//         },
//         designation: {
//             type: String,
//             required: [true, "designation is required"],
//         },
//         postedBy: {
//             type: ObjectId,
//             ref: "User",
//         },
//         image: {
//             url: String,
//             public_id: String,
//         },

//     },
//     { timestamps: true }
// );
