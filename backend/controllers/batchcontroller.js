const ErrorHandler = require("../utils/errorhander");
const catchAsyncError = require("../middleware/catchAsyncError");
const Batches = require("../models/batchModel.js");

exports.createBatch = catchAsyncError(async (req, res, next) => {
  req.body.createdBy = {
    user: req.user.id,
    name: req.user.name,
  };
  const existBatch = await Batches.findOne({"batchCode": req.body.batchCode})
  if(existBatch){
    return next(new ErrorHandler("Try another batch code", 409));
  }
  const batch = await Batches.create(req.body);

  res.status(201).json({ success: true, batch });
});
exports.getAllBatches = catchAsyncError(async (req, res, next) => {
  const batches = await Batches.find();

  res.status(200).json({ success: true, batches });
});
exports.deleteBatch = catchAsyncError(async (req, res, next) => {
  const batch = await Batches.findOne({ _id: req.params.id });
  if(!batch){
    return next(new ErrorHandler("Batch is not found", 409));
  }
  await Batches.findByIdAndDelete({ _id: batch._id })
  res.status(200).json({ success: true, message:"Batch deleted successfully" });
});
