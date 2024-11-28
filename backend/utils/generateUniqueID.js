const ErrorHandler = require("../utils/errorhander");
const catchAsyncError = require("../middleware/catchAsyncError");
const Students = require("../models/studentModel");
const Batches = require("../models/batchModel");
const Users = require("../models/userModel");
const sendSMS = require("../utils/sendSms");

exports.generateUniqueID = catchAsyncError(async (req, res, next) => {
  const { session } = req
  try {
    const batch = await Batches.findOne({ _id: req.student.batchDetails.batchId }).session(session);

    if (!batch) {
      return next(new ErrorHandler("Batch not found", 400));
    }
    const batchCode = batch.batchCode;

    let count = await Students.countDocuments({
      status: "approved",
      batch: batch._id,
    }).session(session);
    count = count +  1
    const paddedCount = count.toString().padStart(2, "0");
    
    // console.log(paddedCount)
    const uniqueID = `${batchCode}${paddedCount}`;
    // console.log(uniqueID)
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
    ).session(session);

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
    ).session(session);

    await sendSMS({
      number: student.whatsappNumber,
      message: `Dear ${student.name}, Your Registration is Approved. Your Student ID is ${student.studentID} From: Science Tent( ${batch.branch} )`,
    });

    await session.commitTransaction()
    session.endSession()

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
