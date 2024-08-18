const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "Not Set",
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [2, "Name should be at least 2 characters long"],
  },
  branch: {
    type: String,
    required: [true, "Please Enter a Branch Name"],
  },
  finalYear: {
    type: Number,
    required: [true, "Please provide a year"],
    min: [1900, "Year should be greater than or equal to 1900"],
  },
  batchCode: {
    type: String,
    required: [true, "Please Enter a Batch Code"],
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

module.exports = mongoose.model("Batches", batchSchema);
