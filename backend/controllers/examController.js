const ErrorHandler = require("../utils/errorhander");
const catchAsyncError = require("../middleware/catchAsyncError");
const Exam = require("../models/examModel");
const Batch = require("../models/batchModel")

// exports.createExam = catchAsyncError(async (req, res, next) => {
//     console.log("======================")
//     console.log(req.body)
//     console.log("======================")
//     try {
//       const { date, time, totalMarks, courses, batches, guards } = req.body;
  
//       // Validate input
//       if (!date || !time || !totalMarks || !courses || !batches || !guards) {
//         return next(new ErrorHandler("All fields are required.", 400));
//       }
  
//       // Create the exam document
//       const exam = await Exam.create({
//         date,
//         time,
//         totalMarks,
//         courses,
//         batches,
//         guards,
//         createdBy: {
//           user: req.user._id, // Assumes `req.user` contains the authenticated user's details
//           name: req.user.name,
//         },
//       });
  
//       res.status(201).json({ success: true, message: "Exam created successfully.", exam });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ success: false, message: "Server error. Please try again later." });
//     }
//   });


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