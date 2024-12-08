const mongoose = require("mongoose");

const examSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true,
  },
  examCode:{
    type: String,
    required: true,
  },
  
  totalMarks: {
    type: Number,
    required: true, // Ensures total marks are provided
    min: 0, // Validates that total marks cannot be negative
  },
  courses: [
    {
      course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Courses", // Reference to the Courses collection
        required: true,
      },
      courseName: {
        type: String,
        required: true,
      },
      courseCode: {
        type: String,
        required: true,
      },
      marks: {
        type: Number,
        required: true,
      },
      date: {
        type: Date,
        required: true, // Specific date for this course
      },
      time: {
        type: String,
        required: true, // Specific time for this course
      }
    },
  ],
  batches: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Batches", // Reference to the Batches collection
        required: true,
      },
      branch: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      batchCode: {
        type: String,
        required: true,
      },
    },
  ],
  guards: [
    {
      name: {
        type: String,
        required: true,
      },
      mobile: {
        type: String,
        required: true,
      },
      center: {
        type: String,
        required: true,
      },
    },
  ],
  Result: [
    {
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Students", // Reference to the Students collection
        required: true,
      },
      courses: [
        {
          course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Courses", // Reference to the Courses collection
            required: true,
          },
          marks: {
            type: Number,
            required: true, // Marks scored in this course
          },
        },
      ],
      batch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Batches", // Reference to the Batches collection
        required: true,
      },
    },
  ],
  
  createdBy: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users", // Reference to the Users collection
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically sets the current date and time
  },
});

module.exports = mongoose.model("Exams", examSchema);
