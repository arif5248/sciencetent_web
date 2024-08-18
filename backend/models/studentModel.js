const mongoose = require("mongoose");

const studentsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  studentID: {
    type: String,
    default: "pending",
  },
  name: {
    type: String,
    required: [true, "Please Provide your Full Name"],
    maxLength: [30, "Name cna not excced 30 charaters"],
    minLength: [2, "Name should have more then 2 characters long"],
  },
  fatherName: {
    type: String,
    required: [true, "Please Provide your Father Name"],
    maxLength: [30, "Name cna not excced 30 charaters"],
    minLength: [2, "Name should have more then 2 characters long"],
  },
  motherName: {
    type: String,
    required: [true, "Please Enter your Name"],
    maxLength: [30, "Name cna not excced 30 charaters"],
    minLength: [2, "Name should have more then 2 characters long"],
  },
  whatsappNumber: {
    type: String,
    validate: {
      validator: function (v) {
        return /\d{11}/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    required: [true, "Please Enter your whatsapp Number"],
  },
  dateOfBirth: {
    type: Date,
    required: [true, "Please provide your date of birth"],
  },
  collegeName: {
    type: String,
    required: [true, "Please provide your college name"],
  },
  address: {
    type: String,
    required: [true, "Please provide your address"],
  },
  batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Batches",
    required: true,
  },
  enrolledCourses: [
    {
      courseID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Courses",
        required: true,
      },
      name: {
        type: String,
        required: [true, "Please enroll atleast one subject"],
      },
    },
  ],
  guardianInfo: {
    name: {
      type: String,
      required: [true, "Please Provide your Guardian Name"],
      maxLength: [30, "Name cna not excced 30 charaters"],
      minLength: [2, "Name should have more then 2 characters long"],
    },
    mobile: {
      type: String,
      validate: {
        validator: function (v) {
          return /\d{11}/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
      required: [true, "Please Enter your guardina mobile umber"],
    },
    relationWithStudent: {
      type: String,
      required: [true, "Please provide Guardian Relation with You"],
    },
    signature: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  },
  admisionFeeRef: {
    type: String,
    default: "Payment not Completed",
  },
  allClasses: [
    {
      class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Classes",
      },
      name: {
        type: String,
      },
    },
  ],
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
});

module.exports = mongoose.model("Students", studentsSchema);
