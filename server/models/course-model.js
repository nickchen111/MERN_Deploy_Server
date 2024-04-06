const mongoose = require("mongoose");
const { Schema } = mongoose;

const courseSchema = new Schema({
  id: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId, // mongoose裡面的primary key
    ref: "User", // 連結到User 就可以用populate連結到user裡面的data
  },
  students: {
    type: [String],
    default: [],
  },
});

module.exports = mongoose.model("Course", courseSchema);
