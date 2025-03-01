const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
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
  classes: [
    {
      courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Courses",
        required: [true, "Provide a Course"],
      },
      courseCode: {
        type: String,
        required: [true, "Please Enter the course code"],
      },
      courseName: {
        type: String,
        required: [true, "Please Enter the course name"],
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
        enum: ["pending", "approved", "postponed", "cancel"],
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
    }
  ],
  msgReports: [
    {
      date: {
        type: Date,
        required: [true, "Please provide class Date"],
      },
      allReports : [
        {
          studentId: {
            type: String,
            required: [true, "Please provide student id"],
          },
          studentName: {
            type: String,
            required: [true, "Please provide student Name"],
          },
          studentNumber: {
            type: String,
            validate: {
              validator: function (v) {
                return /\d{11}/.test(v);
              },
              message: (props) => `${props.value} is not a valid phone number!`,
            },
            required: [true, "Please Enter Student Number"],
          },
          status: {
            type: String,
            enum: ["sent", "failed","notExecute", "notApplicable"],
            default: "notExecute",
          },
          message: {
            type: String,
            required: [true, "Please Enter Message"],
          }
        }
      ]
    }
  ]
 
});

module.exports = mongoose.model("Classes", classSchema);
