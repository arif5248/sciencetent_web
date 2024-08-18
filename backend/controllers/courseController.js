const ErrorHandler = require("../utils/errorhander");
const catchAsyncError = require("../middleware/catchAsyncError");
const Batches = require("../models/batchModel.js");
const Courses = require("../models/courseModel.js");

exports.createCourse = catchAsyncError(async (req, res) => {
  req.body.createdBy = {
    user: req.user.id,
    name: req.user.name,
  };
  const course = await Courses.create(req.body);

  res.status(201).json({ success: true, course });
});
exports.getAllCourses = catchAsyncError(async (req, res, next) => {
  const courses = await Courses.find();

  if (!courses) {
    next(new ErrorHandler("Please Create Course First", 500));
  }

  res.status(200).json({ success: true, courses });
});
