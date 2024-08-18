const ErrorHandler = require("../utils/errorhander");
const catchAsyncError = require("../middleware/catchAsyncError");
const Students = require("../models/studentModel");
const Courses = require("../models/courseModel");

exports.registerStudent = catchAsyncError(async (req, res, next) => {
  const registeredStudent = await Students.find({ user: req.user._id });
  if (registeredStudent.length !== 0) {
    return next(new ErrorHandler("You are already registered this form", 400));
  }
  const user = req.user.id;
  const {
    name,
    fatherName,
    motherName,
    whatsappNumber,
    dateOfBirth,
    collegeName,
    address,
    batch,
    enrolledCourses,
    guardianInfo,
  } = req.body;

  const courseDetails = await Promise.all(
    enrolledCourses.map(async (course) => {
      const courseDetails = await Courses.findById(course.courseID);
      return {
        courseID: courseDetails._id,
        name: courseDetails.name,
      };
    })
  );

  const student = await Students.create({
    user,
    name,
    fatherName,
    motherName,
    whatsappNumber,
    dateOfBirth,
    collegeName,
    address,
    batch,
    enrolledCourses: courseDetails,
    guardianInfo,
  });

  res.status(200).json({ success: true, student });
});

exports.getAllStudents = catchAsyncError(async (req, res, next) => {
  const students = await Students.find();

  res.status(200).json({ success: true, students });
});
exports.getAllPendingStudents = catchAsyncError(async (req, res, next) => {
  const students = await Students.find({
    status: "pending",
  });

  res.status(200).json({ success: true, students });
});
exports.getAllApprovedStudents = catchAsyncError(async (req, res, next) => {
  const students = await Students.find({
    status: "approved",
  });

  res.status(200).json({ success: true, students });
});
exports.getAllRejectedStudents = catchAsyncError(async (req, res, next) => {
  const students = await Students.find({
    status: "rejected",
  });

  res.status(200).json({ success: true, students });
});

exports.getAllRejectedStudents = catchAsyncError(async (req, res, next) => {
  const students = await Students.find({
    batch: req.params.batchID,
    status: "approved",
  });

  res.status(200).json({ success: true, students });
});

exports.approveStudent = catchAsyncError(async (req, res, next) => {
  const student = await Students.findById(req.params.id);
  if (student.status === "approved") {
    return next(new ErrorHandler("Status is already approved", 400));
  } else {
    const newStatus = {
      status: "approved",
    };

    const approvedStudent = await Students.findByIdAndUpdate(
      student._id,
      newStatus,
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    if (!student) {
      return next(new ErrorHandler("Student not found", 400));
    }

    req.student = approvedStudent;

    next();
  }
});
exports.test = catchAsyncError(async (req, res) => {
  const studentID = req.user.studentRef;
  const student = await Students.findById(studentID);
  console.log("++++==============================", studentID);
  res.status(200).json({ success: true, message: "working", student });
});
