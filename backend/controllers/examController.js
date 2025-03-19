const mongoose = require("mongoose");
const ErrorHandler = require("../utils/errorhander");
const catchAsyncError = require("../middleware/catchAsyncError");
const Exam = require("../models/examModel");
const Batch = require("../models/batchModel")
const Student = require("../models/studentModel")

  exports.createExam = catchAsyncError(async (req, res, next) => {
    try {
        const { name, examCode, totalMarks } = req.body;
        // const isExist = await Exam.findOne({"examCode": examCode})
        // if(isExist){
        //   return next(new ErrorHandler(`Batch not found`, 400));
        // }
        const courses = JSON.parse(req.body.courses);
        const batches = JSON.parse(req.body.batches);
        const guards = JSON.parse(req.body.guards);

        // Fetch all students for the given batches
        const batchIds = batches.map(batch => batch._id);
        const students = await Student.find({ "batchDetails.batchId": { $in: batchIds },status: "approved" })

        // Initialize result with all students and set marks to null
        const result = batches.map(batch => {
            const batchStudents = students.filter(student => 
                student.batchDetails.batchId.toString() === batch._id.toString()
            );

            return {
                batchId: batch._id,
                batchWiseResult: batchStudents.map(student => ({
                    student: student._id,
                    studentID: student.studentID,
                    studentName: student.name,
                    courses: courses.map(course => ({
                        courseId: course.course,
                        courseName: course.courseName,
                        marks: {
                            cq: "null",
                            mcq: "null"
                        }
                    }))
                }))
            };
        });

        // Create the exam object
        const examData = {
            name,
            examCode,
            totalMarks,
            courses,
            batches,
            guards,
            result, // Include default result field
            createdBy: {
                user: req.user._id,
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

exports.modifyExam = catchAsyncError(async (req, res, next) => {
  try {
    const { examId, name, examCode, totalMarks } = req.body;

    const courses = JSON.parse(req.body.courses); // Existing + new courses
    const batches = JSON.parse(req.body.batches); // Existing + new batches
    const guards = JSON.parse(req.body.guards); // Existing + new guards

    // Find the existing exam
    const exam = await Exam.findById(examId);
    if (!exam) {
      return next(new ErrorHandler("Exam not found", 404));
    }

    // Identify new courses
    const existingCourseIds = exam.courses.map(course => course.course.toString());
    const newCourses = courses.filter(course => !existingCourseIds.includes(course.course.toString()));

    // Identify new batches
    const existingBatchIds = exam.batches.map(batch => batch._id.toString());
    const newBatches = batches.filter(batch => !existingBatchIds.includes(batch._id.toString()));

    // Fetch all students for the newly added batches
    const newBatchIds = newBatches.map(batch => batch._id);
    const newStudents = await Student.find({ "batchDetails.batchId": { $in: newBatchIds }, status: "approved" });

    // Update results
    exam.result.forEach(result => {
      // Check if batch exists in the result
      const batchExists = batches.find(batch => batch._id.toString() === result.batchId.toString());
      if (batchExists) {
        // Add only new courses to the existing batch results
        result.batchWiseResult.forEach(studentResult => {
          newCourses.forEach(course => {
            if (!studentResult.courses.some(c => c.courseId.toString() === course.course.toString())) {
              studentResult.courses.push({
                courseId: course.course,
                courseName: course.courseName,
                marks: { cq: "null", mcq: "null" }
              });
            }
          });
        });
      }
    });

    // Add new batch results
    newBatches.forEach(batch => {
      const batchStudents = newStudents.filter(student => student.batchDetails.batchId.toString() === batch._id.toString());
      exam.result.push({
        batchId: batch._id,
        batchWiseResult: batchStudents.map(student => ({
          student: student._id,
          studentID: student.studentID,
          studentName: student.name,
          courses: courses.map(course => ({
            courseId: course.course,
            courseName: course.courseName,
            marks: { cq: "null", mcq: "null" }
          }))
        }))
      });
    });

    // Update exam details
    exam.name = name || exam.name;
    exam.examCode = examCode || exam.examCode;
    exam.totalMarks = totalMarks || exam.totalMarks;
    exam.courses = courses; // Updated courses list
    exam.batches = batches; // Updated batches list
    exam.guards = guards; // Updated guards list

    await exam.save();

    res.status(200).json({ message: "Exam updated successfully", exam });

  } catch (error) {
    return next(new ErrorHandler(`Error modifying exam = ${error}`, 500));
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

exports.getAllExamOptionsBatchWise = catchAsyncError(async (req, res, next) => {     
  const { batchId } = req.params;  

  // Validate batch ID     
  const batch = await Batch.findById(batchId);     
  if (!batch) {         
      return next(new ErrorHandler(`Batch not found`, 400));     
  }  

  // Fetch only exam _id and name associated with the batch     
  const exams = await Exam.find(
      { 'batches._id': batchId }  // Match batchId in the batches array
  ).select('_id name examCode'); // Select only _id and name

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

exports.getSingleExamDetails = catchAsyncError(async (req, res, next) => {
  const exam = await Exam.findById(req.params.id);
  if (!exam) {
    return next(
      new ErrorHandler(`Exam doesn't exist with Id: ${req.params.id}`, 400)
    );
  }
  res.status(200).json({ success: true, exam });
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



exports.courseWiseMarksInput = catchAsyncError(async (req, res, next) => {
  const { examId, batchId, courseId, students } = req.body; // Extract data from request
  const session = await mongoose.startSession(); // Start a transaction session

  try {
    session.startTransaction(); // Begin a transaction

    // Iterate over each student and update their marks
    for (const student of students) {
      const { studentId, marks } = student;

      // Convert studentId to ObjectId using 'new' keyword
      // const studentObjectId = new mongoose.Types.ObjectId(studentId);

      const result = await Exam.updateOne(
        { _id: examId, "result.batchId": batchId }, // Find the exam and batch
        {
          $set: {
            "result.$.batchWiseResult.$[student].courses.$[course].marks": marks, // Update marks
          },
        },
        {
          arrayFilters: [
            { "student.studentID": studentId }, // Use ObjectId for comparison
            { "course.courseId": courseId }, // Match specific course
          ],
          session, // Ensure update happens in transaction
        }
      );

      if (result.modifiedCount === 0) {
        throw new Error(`Failed to update marks for student ${studentId}`); // Force rollback
      }
    }

    await session.commitTransaction(); // Commit transaction if all updates succeed
    session.endSession();
    
    res.status(200).json({
      success: true,
      message: "Marks updated successfully!",
    });
  } catch (error) {
    await session.abortTransaction(); // Rollback all changes on error
    session.endSession();
    
    res.status(500).json({
      success: false,
      message: "Failed to update marks",
      error: error.message,
    });
  }
});


