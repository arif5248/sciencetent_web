const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Batches",
    required: [true, "Provide a Batch"],
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Courses",
    required: [true, "Provide a Cours"],
  },
  date: {
    type: Date,
    required: [true, "Please provide class Date"],
  },
  startingTime: {
    type: String,
    validate: {
      validator: (value) => {
        const timeFormat = /^(0?[1-9]|1[0-2]):[0-5][0-9][ap]m$/i;
        return timeFormat.test(value);
      },
      message: "Invalid time format. Please use HH:MM{am/pm} format.",
    },
  },
  finishingTime: {
    type: String,
    validate: {
      validator: (value) => {
        const timeFormat = /^(0?[1-9]|1[0-2]):[0-5][0-9][ap]m$/i;
        return timeFormat.test(value);
      },
      message: "Invalid time format. Please use HH:MM{am/pm} format.",
    },
  },
  teacherName: {
    type: String,
    default: "Not Set",
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [2, "Name should be at least 2 characters long"],
  },
  classDuration: {
    type: Number,
    required: [true, "Please Enter Number of Class"],
  },
  status: {
    type: String,
    enum: ["pending", "approved", "postponed"],
    default: "pending",
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

module.exports = mongoose.model("Classes", classSchema);
