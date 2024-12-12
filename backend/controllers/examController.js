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

// exports.batchWiseMarksInput = catchAsyncError(async (req, res, next) => {
//   const { allMarks } = req.body;

//   // Check if the exam exists
//   const exam = await Exam.findById(req.params.examId);
//   if (!exam) {
//     return next(new ErrorHandler(`Exam not found`, 400));
//   }

//   // Validate allMarks structure
//   if (!Array.isArray(allMarks) || allMarks.length === 0) {
//     return next(new ErrorHandler(`Invalid data for marks`, 400));
//   }
   
  
//   // Prepare data for insertion into the Result array
  

//   const resultEntries = allMarks.map((mark) => ({
//     student: mark.student,
//     courses: mark.courses.map((course) => ({
//       course: course.courseId,
//       marks: course.marks,
//     })),
//     batch: mark.batch,
//   }));

//   console.log(JSON.stringify(resultEntries, null, 2));

//   for (const resultEntry of resultEntries) {
//     const updatedExam = await Exam.findByIdAndUpdate(
//       req.params.examId,
//       {
//         $push: {
//           result: {
//             student: resultEntry.student,
//             courses: resultEntry.courses,
//             batch: resultEntry.batch
//           },
//         },
//       },
//       { new: true, useFindAndModify: false }
//     );
//   }


//   // Update the Result array
//   // await Exam.findByIdAndUpdate(
//   //   req.params.examId,
//   //   { $push: { result: { $each: resultEntries } } },
//   //   { new: true, runValidators: true }
//   // );
  

//   res.status(200).json({
//     success: true,
//     message: "Marks input successfully...",
//   });
// });








exports.batchWiseMarksInput = catchAsyncError(async (req, res, next) => {
  const { allMarks } = req.body;

  // Check if the exam exists
  const exam = await Exam.findById(req.params.examId);
  if (!exam) {
    return next(new ErrorHandler(`Exam not found`, 400));
  }

  // Validate allMarks structure
  if (!Array.isArray(allMarks) || allMarks.length === 0) {
    return next(new ErrorHandler(`Invalid data for marks`, 400));
  }
  // Prepare data for insertion into the Result array
  const resultEntries = allMarks.map((mark) => ({
    student: mark.student,
    courses: mark.courses.map((course) => ({
      courseId: course.courseId,
      marks: course.marks,
    })),
    batch: mark.batch,
  }));

  // console.log(JSON.stringify(resultEntries, null, 2));

  // Overwrite the Result array with the new data
  await Exam.findByIdAndUpdate(
    req.params.examId,
    {
      $set: {
        result: resultEntries, // Replacing the entire result array
      },
    },
    { new: true, useFindAndModify: false }
  );

  res.status(200).json({
    success: true,
    message: "Marks input successfully, result array updated!",
  });
});
