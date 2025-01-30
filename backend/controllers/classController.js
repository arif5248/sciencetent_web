const ErrorHandler = require("../utils/errorhander");
const catchAsyncError = require("../middleware/catchAsyncError");
const Classes = require("../models/classModel");

exports.createClass = catchAsyncError(async (req, res, next) => {
  const { batch, courseDetails, date, startingTime, finishingTime, teacherName, classDuration, status } = req.body;
  console.log(courseDetails)
  console.log(typeof(courseDetails))
  if (!batch || !courseDetails || !date || !classDuration || !startingTime) {
      return next(new ErrorHandler("Missing required fields", 400));
  }

  const classDate = new Date(date);
  const month = classDate.getMonth();
  const year = classDate.getFullYear();
  const monthAndYear = `${year}-${String(month + 1).padStart(2, "0")}`; // Format: YYYY-MM

  // Find existing class entry for the same batch and month/year
  let existingClass = await Classes.findOne({
      batch,
      monthAndYear
  });

  // Check if the same date and starting time already exist
  if (existingClass) {
      const isDuplicate = existingClass.classes.some(cls => 
          cls.date.toISOString().split("T")[0] === classDate.toISOString().split("T")[0] &&
          cls.startingTime === startingTime
      );

      if (isDuplicate) {
          return next(new ErrorHandler("Class with the same date and starting time already exists", 400));
      }

      // Add new class to the existing batch entry
      existingClass.classes.push({
          course:{
            courseId: courseDetails.courseId,
            courseCode: courseDetails.courseCode,
            courseName: courseDetails.courseName
          },
          date: classDate,
          startingTime,
          finishingTime,
          teacherName: teacherName || "Not Set",
          classDuration,
          status: status || "pending",
          createdBy: {
              user: req.user._id,
              name: req.user.name
          }
      });

      await existingClass.save();
      return res.status(201).json({ success: true, message: "Class added to existing batch", data: existingClass });
  } else {
      // If no existing class for the month, create a new one
      const newClassEntry = new Classes({
          batch,
          monthAndYear,
          classes: [{
            course:{
            courseId: courseDetails.courseId,
            courseCode: courseDetails.courseCode,
            courseName: courseDetails.courseName
            },
            date: classDate,
            startingTime,
            finishingTime,
            teacherName: teacherName || "Not Set",
            classDuration,
            status: status || "pending",
            createdBy: {
                user: req.user._id,
                name: req.user.name
            }
          }]
      });

      await newClassEntry.save();
      return res.status(201).json({ success: true, message: "New class entry created", class: newClassEntry });
  }
});

