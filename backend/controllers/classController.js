const ErrorHandler = require("../utils/errorhander");
const catchAsyncError = require("../middleware/catchAsyncError");
const Classes = require("../models/classModel");

exports.createClass = catchAsyncError(async (req, res, next) => {
  req.body.createdBy = {
    user: req.user.id,
    name: req.user.name,
  };
  const classInfo = await Classes.create(req.body);

  req.classInfo = classInfo;
  next();
});
