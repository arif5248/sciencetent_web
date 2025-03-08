const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Batches",
    required: [true, "Provide a Batch"],
  },
  monthAndYear: {
    type: String,  // Format: "YYYY-MM"
    required: true,
    index: true  // Improves query performance
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Students",
    required: true,
    unique: true, // One record per student
  },
  studentId: {
    type: String,
    required: [true, "Please provide student id"],
  },
  studentName: {
    type: String,
    required: [true, "Please provide student Name"],
  },
  Records: [
    {
      date: {
        type: Date,
        required: [true, "Please provide class Date"],
      },
      clockIn: {
        type: String,
        validate: {
          validator: (value) => {
            const timeFormat = /^(0?[1-9]|1[0-2]):[0-5][0-9][ap]m$/i;
            return timeFormat.test(value);
          },
          message: "Invalid time format. Please use HH:MM{am/pm} format.",
        },
      },
      clockOut: {
        type: String,
        validate: {
          validator: (value) => {
            const timeFormat = /^(0?[1-9]|1[0-2]):[0-5][0-9][ap]m$/i;
            return timeFormat.test(value);
          },
          message: "Invalid time format. Please use HH:MM{am/pm} format.",
        },
      },
      attendanceData: [
        {
          courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Courses",
            required: true,
          },
          courseName: {
            type: String,
            required: [true, "Please Enter the course name"],
          },
          attendanceStatus: {
            type: String,
            required: [true, "Please Enter attendance status"],
            enum: ["present", "absent","earlyLeave", "authorizedAbsent"],
            default: "absent",
          },
        }
      ]
    }
  ]
});

module.exports = mongoose.model("Attendance", attendanceSchema);    