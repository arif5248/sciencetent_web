const ErrorHandler = require("../utils/errorhander");
const catchAsyncError = require("../middleware/catchAsyncError");
const Classes = require("../models/classModel");

exports.approvedClass = catchAsyncError(async (req, res, next) => {
  const classInfo = req.classInfo;

  const newStatus = {
    status: "approved",
  };

  const approvedClass = await Classes.findByIdAndUpdate(
    classInfo._id,
    newStatus,
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  if (!approvedClass) {
    return next(new ErrorHandler("Class is not updated", 400));
  }

  req.classInfo = approvedClass;

  next();
});
