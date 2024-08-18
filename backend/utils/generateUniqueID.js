const ErrorHandler = require("../utils/errorhander");
const catchAsyncError = require("../middleware/catchAsyncError");
const Students = require("../models/studentModel");
const Batches = require("../models/batchModel");
const Users = require("../models/userModel");
const sendSMS = require("../utils/sendSms");

exports.generateUniqueID = catchAsyncError(async (req, res, next) => {
  const batch = await Batches.findOne({ _id: req.student.batch });

  if (!batch) {
    return next(new ErrorHandler("Batch not found", 400));
  }
  const batchCode = batch.batchCode;

  try {
    const count = await Students.countDocuments({
      status: "approved",
      batch: batch._id,
    });

    const paddedCount = count.toString().padStart(2, "0");
    const uniqueID = `${batchCode}${paddedCount}`;

    const setUniqueID = {
      studentID: uniqueID,
    };

    const student = await Students.findByIdAndUpdate(
      req.student.id,
      setUniqueID,
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    if (!student) {
      return next(new ErrorHandler("Student not found", 400));
    }

    const setStudentRef = {
      studentRef: req.student._id,
    };

    const user = await Users.findByIdAndUpdate(
      req.student.user,
      setStudentRef,
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    // await sendSMS({
    //   number: student.whatsappNumber,
    //   message: `Dear ${student.name}, Your Registration is Approved. Your Student ID is ${student.studentID} From: Science Tent( ${batch.branch} Branch )`,
    // });

    res.status(200).json({ success: true, student });
  } catch (error) {
    console.error("Error generating unique ID:", error);
    const setUniqueIDandStatus = {
      studentID: "pending",
      status: "pending",
    };

    await Students.findByIdAndUpdate(req.student.id, setUniqueIDandStatus, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    next(new ErrorHandler("Failed to generate unique ID", 500));
  }
});
