const ErrorHandler = require("../utils/errorhander");
const catchAsyncError = require("../middleware/catchAsyncError");
const Batches = require("../models/batchModel.js");
const Courses = require("../models/courseModel.js");

exports.createCourse = catchAsyncError(async (req, res, next) => {
  req.body.createdBy = {
    user: req.user.id,
    name: req.user.name,
  };
  const existCourse = await Courses.findOne({"courseCode": req.body.courseCode})
  if(existCourse){
    return next(new ErrorHandler(`Try another course code. You have already used it for ${existCourse.name}`, 409));
  }
  const course = await Courses.create(req.body);

  res.status(201).json({ success: true, course });
});

exports.getAllCourses = catchAsyncError(async (req, res, next) => {
  const courses = await Courses.find();

  res.status(200).json({ success: true, courses });
});

exports.deleteCourse = catchAsyncError(async (req, res, next) => {
  const course = await Courses.findOne({ _id: req.params.id });
  if(!course){
    return next(new ErrorHandler("Course is not found", 409));
  }
  await Courses.findByIdAndDelete({ _id: course._id })
  res.status(200).json({ success: true, message:"Course is deleted successfully" });
});
exports.editCourse = catchAsyncError(async (req, res, next) => {
  let course = await Courses.findOne({ _id: req.params.id });
  if(!course){
    return next(new ErrorHandler("Course is not found", 409));
  }
  const newCourseData = req.body
  course = await Batches.findByIdAndUpdate(course._id, newCourseData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({ success: true, message:"Course Edited successfully", course});
});