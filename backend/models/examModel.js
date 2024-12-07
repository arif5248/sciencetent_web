const mongoose = require("mongoose");

const examSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true, // Ensures date is provided
  },
  time: {
    type: String,
    required: true, // Ensures time is provided
  },
  totalMarks: {
    type: Number,
    required: true, // Ensures total marks are provided
    min: 0, // Validates that total marks cannot be negative
  },
  courses: {
    type: [String], // Array of strings to accommodate multiple courses
    required: true, // Ensures at least one course is provided
  },
  batchName: {
    type: String,
    required: true, // Ensures batch name is provided
    trim: true, // Removes unnecessary spaces
  },
  assignedGuard: {
    name: {
      type: String,
      required: true, // Ensures guard name is provided
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users", // Reference to the Users collection
      required: true, // Ensures a valid user ID is assigned
    },
  },
  createdBy: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users", // Reference to the Users collection
      required: true, // Ensures a valid user ID is set
    },
    name: {
      type: String,
      required: true, // Ensures the name of the creator is provided
    },
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically sets the current date and time
  },
});

module.exports = mongoose.model("Exams", examSchema);
