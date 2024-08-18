const mongoose = require("mongoose");

const classNotificationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Students",
  },
  studentName: {
    type: String,
    required: [true, "Please Enter a Student Name"],
  },
  mobileNumber: {
    type: String,
    validate: {
      validator: function (v) {
        return /\d{11}/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    required: [true, "Please Enter your whatsapp Number"],
  },
  branch: {
    type: String,
    required: [true, "Please Enter a Branch Name"],
  },
  date: {
    type: String,
    required: [true, "Please provide class Date"],
  },
  subject: [
    {
      subjectName: String,
      startingTime: String,
      finishingTime: String,
    },
  ],

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
});

module.exports = mongoose.model("ClassNotifiactions", classNotificationSchema);
