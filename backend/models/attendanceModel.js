const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Students",
    required: true,
    unique: true, // One record per student
  },
  records: [
    {
      class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Classes",
        required: true,
      },
      course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Courses",
        required: true,
      },
      batch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Batches",
        required: true,
      },
      date: {
        type: Date,
        required: true,
      },
      status: {
        type: String,
        enum: ["present", "absent", "late"],
        default: "absent",
      },
      scannedQR: {
        type: Boolean,
        default: false, // Indicates if the student scanned the QR
      },
    },
  ],
});

module.exports = mongoose.model("Attendance", attendanceSchema);    