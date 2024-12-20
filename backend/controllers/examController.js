const mongoose = require("mongoose");
const ErrorHandler = require("../utils/errorhander");
const catchAsyncError = require("../middleware/catchAsyncError");
const Exam = require("../models/examModel");
const Batch = require("../models/batchModel")



  exports.createExam = catchAsyncError(async (req, res, next) => {
    try {
      const examData = {
        name: req.body.name,
        examCode: req.body.examCode,
        // date: req.body.date,
        // time: req.body.time,
        totalMarks: req.body.totalMarks,
        courses: JSON.parse(req.body.courses),
        batches: JSON.parse(req.body.batches),
        guards: JSON.parse(req.body.guards),
        createdBy: {
          user: req.user._id, // Assume `req.user` contains authenticated user info
          name: req.user.name,
        },
      };
  
      const newExam = new Exam(examData);
      await newExam.save();
  
      res.status(201).json({ message: "Exam created successfully", exam: newExam });
    } catch (error) {
      return next(new ErrorHandler(`Error creating exam = ${error}`, 500));
    }
  });

  exports.getAllExamBatchWise = catchAsyncError(async (req, res, next) => {
    const { batchId } = req.params;

    // Validate batch ID
    const batch = await Batch.findById(batchId);
    if (!batch) {
        return next(new ErrorHandler(`Batch not found`, 400));
    }

    // Fetch exams associated with the batch
    const exams = await Exam.find({
        'batches._id': batchId, // Match batchId in the batches array
    })

    // Check if exams exist
    if (exams.length === 0) {
        return res.status(404).json({
            success: false,
            message: 'No exams found for the specified batch.',
        });
    }

    // Send response
    res.status(200).json({
        success: true,
        exams,
    });
});


exports.batchWiseMarksInput = catchAsyncError(async (req, res, next) => {
  const { resultData } = req.body; // Extracting resultData from the request body

  // Validate input data
  if (!resultData || !resultData.batchId || resultData.batchWiseResult.length === 0) {
    return next(new ErrorHandler(`Invalid data for marks`, 400));
  }

  // Check if the exam exists
  const exam = await Exam.findById(req.params.examId);
  if (!exam) {
    return next(new ErrorHandler(`Exam not found`, 404));
  }

  // Check if batchId already exists in the result array
  const existingBatch = exam.result.find(item => 
    item.batchId.equals(resultData.batchId)
  );

  if (existingBatch) {
    return res.status(200).json({
      success: true,
      message: "Marks already inputted for this batch",
    });
  }

  // Push new resultData into the result array
  exam.result.push(resultData);

  // Save the updated exam document
  await exam.save();

  res.status(200).json({
    success: true,
    message: "Marks input successfully, result array updated!",
  });
});

