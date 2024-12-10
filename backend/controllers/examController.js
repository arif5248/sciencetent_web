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
  const mongoose = require("mongoose");

  const resultEntries = allMarks.map((mark) => ({
    student: mongoose.Types.ObjectId(mark.student),
    courses: mark.courses.map((course) => ({
      course: mongoose.Types.ObjectId(course.courseId),
      marks: course.marks,
    })),
    batch: mongoose.Types.ObjectId(mark.batch),
  }));

  console.log(JSON.stringify(resultEntries, null, 2));


  // Update the Result array
  await Exam.findByIdAndUpdate(
    req.params.examId,
    { $push: { result: { $each: resultEntries } } },
    { new: true, runValidators: true }
  );
  

  res.status(200).json({
    success: true,
    message: "Marks input successfully...",
  });
});

// exports.batchWiseMarksInput = catchAsyncError(async (req, res, next) => {
//   const { allMarks } = req.body;

//   console.log("Received allMarks: ", allMarks);

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
//       course: course.courseId, // Ensure you send courseId in the request
//       marks: course.marks,
//     })),
//     batch: mark.batch,
//   }));

//   console.log("Prepared resultEntries: ", resultEntries);

//   // Update the Result array
//   try {
//     const updatedExam = await Exam.findByIdAndUpdate(
//       req.params.examId,
//       { $push: { Result: { $each: resultEntries } } }, // Push multiple entries
//       { new: true, runValidators: true }
//     );

//     if (!updatedExam) {
//       return next(new ErrorHandler(`Exam update failed`, 500));
//     }

//     res.status(200).json({
//       success: true,
//       message: "Marks input successfully",
//     });
//   } catch (err) {
//     console.error("Update error:", err);
//     return next(new ErrorHandler(`Failed to update Result`, 500));
//   }
// });



[
  {
    student: '6743d747018559e9258afd05',
    courses: [ [Object], [Object], [Object], [Object], [Object] ],
    batch: '67407098b87ec169dcd5843d'
  },
  {
    student: '6743d87ff722eb16903637b9',
    courses: [ [Object], [Object], [Object], [Object], [Object] ],
    batch: '67407098b87ec169dcd5843d'
  },
  {
    student: '6743e1bea696501cb9362778',
    courses: [ [Object], [Object], [Object], [Object], [Object] ],
    batch: '67407098b87ec169dcd5843d'
  },
  {
    student: '6743f182754120c2422856ce',
    courses: [ [Object], [Object], [Object], [Object], [Object] ],
    batch: '67407098b87ec169dcd5843d'
  },
  {
    student: '6744391984c5f2ce913dfed7',
    courses: [ [Object], [Object], [Object], [Object], [Object] ],
    batch: '67407098b87ec169dcd5843d'
  },
  {
    student: '67443abfeba7f83b89fff1a7',
    courses: [ [Object], [Object], [Object], [Object], [Object] ],
    batch: '67407098b87ec169dcd5843d'
  },
  {
    student: '674460c6e95a122ea7764c78',
    courses: [ [Object], [Object], [Object], [Object], [Object] ],
    batch: '67407098b87ec169dcd5843d'
  },
  {
    student: '67446a2e649c60040c79a065',
    courses: [ [Object], [Object], [Object], [Object], [Object] ],
    batch: '67407098b87ec169dcd5843d'
  },
  {
    student: '67447ef00a09ec10dc309a3c',
    courses: [ [Object], [Object], [Object], [Object], [Object] ],
    batch: '67407098b87ec169dcd5843d'
  },
  {
    student: '674481814218668615006c77',
    courses: [ [Object], [Object], [Object], [Object], [Object] ],
    batch: '67407098b87ec169dcd5843d'
  },
  {
    student: '67448f0fb6905c449dcc2e1a',
    courses: [ [Object], [Object], [Object], [Object], [Object] ],
    batch: '67407098b87ec169dcd5843d'
  },
  {
    student: '674492e62f5aeb64d7fe2c3d',
    courses: [ [Object], [Object], [Object], [Object], [Object] ],
    batch: '67407098b87ec169dcd5843d'
  },
  {
    student: '6744abd7d257fa8ed85fbed6',
    courses: [ [Object], [Object], [Object], [Object], [Object] ],
    batch: '67407098b87ec169dcd5843d'
  },
  {
    student: '6745852878f0c6cffe1a57da',
    courses: [ [Object], [Object], [Object], [Object], [Object] ],
    batch: '67407098b87ec169dcd5843d'
  },
  {
    student: '6745d3580fe331d1f5aae85f',
    courses: [ [Object], [Object], [Object], [Object], [Object] ],
    batch: '67407098b87ec169dcd5843d'
  },
  {
    student: '6745ebac9a168e82283502ce',
    courses: [ [Object], [Object], [Object], [Object], [Object] ],
    batch: '67407098b87ec169dcd5843d'
  },
  {
    student: '67473d91b537d5b29f6b56da',
    courses: [ [Object], [Object], [Object], [Object], [Object] ],
    batch: '67407098b87ec169dcd5843d'
  },
  {
    student: '67473f03ab5d3a5aa8ac2267',
    courses: [ [Object], [Object], [Object], [Object], [Object] ],
    batch: '67407098b87ec169dcd5843d'
  },
  {
    student: '674743198b089a903082bcfc',
    courses: [ [Object], [Object], [Object], [Object], [Object] ],
    batch: '67407098b87ec169dcd5843d'
  },
  {
    student: '6747460e26c5ed937917f5ac',
    courses: [ [Object], [Object], [Object], [Object], [Object] ],
    batch: '67407098b87ec169dcd5843d'
  },
  {
    student: '67486e3240d5bc69197379f8',
    courses: [ [Object], [Object], [Object], [Object], [Object] ],
    batch: '67407098b87ec169dcd5843d'
  },
  {
    student: '67509527a57330e6d569b554',
    courses: [ [Object], [Object], [Object], [Object], [Object] ],
    batch: '67407098b87ec169dcd5843d'
  },
  {
    student: '6751cd3e13e719390d77797e',
    courses: [ [Object], [Object], [Object], [Object], [Object] ],
    batch: '67407098b87ec169dcd5843d'
  }
]