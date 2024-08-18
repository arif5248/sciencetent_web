const ErrorHandler = require("./errorhander");
const catchAsyncError = require("../middleware/catchAsyncError");
const Students = require("../models/studentModel");
const ClassNotifiactions = require("../models/classNotificationModel");
const Batch = require("../models/batchModel");
const Courses = require("../models/courseModel");

exports.setClassForStudents = catchAsyncError(async (req, res, next) => {
  try {
    const classInfo = req.classInfo;
    const batch = await Batch.findById(classInfo.batch);
    const course = await Courses.findById(classInfo.course);
    const getStudents = await Students.find({
      batch: classInfo.batch,
      "enrolledCourses.courseID": classInfo.course,
    });

    for (const student of getStudents) {
      const updatedStudent = await Students.findByIdAndUpdate(
        student._id,
        {
          $push: {
            allClasses: {
              class: classInfo._id,
              name: course.name,
            },
          },
        },
        { new: true, useFindAndModify: false }
      );
      const notifiedStudent = await ClassNotifiactions.findOne({
        student: updatedStudent._id,
      });

      if (!notifiedStudent) {
        const date = classInfo.date.toISOString().split("T")[0];
        const options = {
          student: updatedStudent._id,
          studentName: updatedStudent.name,
          mobileNumber: updatedStudent.whatsappNumber,
          branch: batch.branch,
          date: date,
          subject: {
            subjectName: course.name,
            startingTime: classInfo.startingTime,
            finishingTime: classInfo.startingTime,
          },
        };

        await ClassNotifiactions.create(options);
      } else {
        await ClassNotifiactions.findByIdAndUpdate(
          notifiedStudent._id,
          {
            $push: {
              subject: {
                subjectName: course.name,
                startingTime: classInfo.startingTime,
                finishingTime: classInfo.startingTime,
              },
            },
          },
          { new: true, useFindAndModify: false }
        );
      }

      if (!updatedStudent) {
        return next(new ErrorHandler("Error updating student", 500));
      }
    }
    res.status(200).json({ success: true, classInfo });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
