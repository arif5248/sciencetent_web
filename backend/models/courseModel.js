const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a Course Name"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [2, "Name should be at least 2 characters long"],
  },
  courseCode: {
    type: String,
    default: "Not Set",
  },
  paymentType: {
    type: String,
    default: "per class",
  },
  paymentAmount: {
    type: Number,
    default: 54.1666666667,
  },
  createdBy: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Courses", courseSchema);
