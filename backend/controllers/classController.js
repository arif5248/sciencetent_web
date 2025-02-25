const ErrorHandler = require("../utils/errorhander");
const catchAsyncError = require("../middleware/catchAsyncError");
const Classes = require("../models/classModel");
const Students = require("../models/studentModel")

exports.createClass = catchAsyncError(async (req, res, next) => {
  const { batch, date, startingTime, finishingTime, teacherName, classDuration, status } = req.body;
  const courseDetails = JSON.parse(req.body.courseDetails);
  
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
        courseId: courseDetails.courseId,
        courseCode: courseDetails.courseCode,
        courseName: courseDetails.courseName,
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
            courseId: courseDetails.courseId,
            courseCode: courseDetails.courseCode,
            courseName: courseDetails.courseName,
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

exports.getPendingClassesGroupedByDate = catchAsyncError(async (req, res, next) => {
    const pendingClasses = await Classes.aggregate([
      { $unwind: "$classes" }, // Flatten the classes array
      { $match: { "classes.status": "pending" } }, // Filter only pending classes
      {
        $lookup: {
          from: "batches", // Joining with Batches collection
          localField: "batch",
          foreignField: "_id",
          as: "batchDetails",
        },
      },
      { $unwind: "$batchDetails" }, // Flatten batch details
      {
        $group: {
          _id: {
            date: "$classes.date",
            batch: "$batch",
          }, // Group by date & batch
          date: { $first: "$classes.date" },
          batchDetails: { $first: "$batchDetails" },
          classes: { $push: "$classes" },
        },
      },
      { $sort: { date: 1 } }, // Sort by date ascending
      {
        $project: {
          _id: 0,
          date: 1,
          batchDetails: 1,
          classes: {
            $sortArray: { input: "$classes", sortBy: { courseCode: 1 } }, // Sort classes by courseCode
          },
        },
      },
    ]);
  
    console.log(pendingClasses);
    res.status(200).json({ success: true, data: pendingClasses });
  });

  const mongoose = require("mongoose");
const formattedDateString = require("../utils/dateConverter");
  
  exports.pendingClassToCancel = catchAsyncError(async (req, res, next) => {
    let { pendingClassesId } = req.body;

    if (!pendingClassesId || !Array.isArray(pendingClassesId) || pendingClassesId.length === 0) {
        return res.status(400).json({ success: false, message: "No class IDs provided" });
    }

    // Convert string IDs to ObjectId
    const objectIdArray = pendingClassesId.map(id => new mongoose.Types.ObjectId(id));

    const result = await Classes.updateMany(
        { "classes._id": { $in: objectIdArray } },
        { $set: { "classes.$[elem].status": "cancel" } },
        { arrayFilters: [{ "elem._id": { $in: objectIdArray } }] }
    );

    if (result.modifiedCount === 0) {
        return res.status(404).json({ success: false, message: "No classes found or already approved" });
    }

    res.status(200).json({
        success: true,
        message: "Classes approved successfully",
        modifiedCount: result.modifiedCount,
    });
});

exports.pendingClassToApprove = catchAsyncError(async (req, res, next) => {
  let classDocId = ""
  let headingPart = ""
  let datePart = ""
  let body = ""
  let lastPart = "Science Tent"

  let { pendingClassesId, batchId } = req.body;

  if (!pendingClassesId || !Array.isArray(pendingClassesId) || pendingClassesId.length === 0) {
      return res.status(400).json({ success: false, message: "No class IDs provided" });
  }

  // Convert string IDs to ObjectId
  const objectIdArray = pendingClassesId.map(id => new mongoose.Types.ObjectId(id));
  const objectBatchId = new mongoose.Types.ObjectId(batchId)

  const result = await Classes.updateMany(
      { "classes._id": { $in: objectIdArray } },
      { $set: { "classes.$[elem].status": "approved" } },
      { arrayFilters: [{ "elem._id": { $in: objectIdArray } }] }
  );

  if (result.modifiedCount === 0) {
      return res.status(404).json({ success: false, message: "No classes found or already approved" });
  }

  // Fetch all students in the batch
  const students = await Students.find({ "batchDetails.batchId": objectBatchId, "status": "approved" });
  let classesArray = await Classes.aggregate([
    { $unwind: "$classes" },
    { $match: { "classes._id": { $in: objectIdArray } } },
    { $project: { _id: 1, classes: 1  } }
  ]);
  classDocId = classesArray.length === 0 ? '' : classesArray[0]._id
  classesArray = classesArray.map(doc => doc.classes);

  datePart = classesArray.length === 0 ? "" :  formattedDateString(classesArray[0].date)
  // For each student, create the message report
  let msgReports = [];
  let allReport = []

  for (const student of students) {
    headingPart = "Dear "+student.name
    body = ''
    classesArray.forEach(classItem => { 
      student.enrolledCourses.forEach(enrolledCourse => {
        if (enrolledCourse.courseID.toString() === classItem.courseId.toString()) { 
          body = body +"\n" + classItem.courseName + ": " + classItem.startingTime + "-" + classItem.finishingTime
        }
      });
    });
    if(body !== ''){
      allReport.push({
          studentId: student.studentID,
          studentName: student.name,
          studentNumber: student.whatsappNumber,
          status: "notExecute",
          message: headingPart + "\n" + datePart + body +"\n" + lastPart
      });
    }
    // else{
    //   console.log("==========", student.name)
    //   allReport.push({
    //     studentId: student.studentID,
    //     studentName: student.name,
    //     studentNumber: student.whatsappNumber,
    //     status: "notApplicable",
    //     message: headingPart + "\n" + datePart.join + "\n" + body.join +"\n" + lastPart
    // });
    // }
  }


  const newReport = {
    date: classesArray[0].date,
    allReports: allReport, // Replace all existing reports
  };
  
  const approveAndReportInserted = await Classes.findOneAndUpdate(
    { _id: classDocId, "msgReports.date": newReport.date }, // Check if the date exists
    { $set: { "msgReports.$.allReports": newReport.allReports } }, // Replace existing allReports
    { new: true }
  )
    .then((updatedClass) => {
      if (!updatedClass) {
        // If no existing date was found, insert a new entry
        return Classes.findByIdAndUpdate(
          classDocId,
          { $push: { msgReports: newReport } }, // Insert a new msgReports object
          { new: true }
        );
      }
      return updatedClass;
    })
    .catch((err) => console.error("Error updating msgReports:", err));

  res.status(200).json({
      success: true,
      message: "Classes approved successfully",
      result,
      modifiedCount: result.modifiedCount,
      approveAndReportInserted
  });
});

exports.updateClassMessageReport = catchAsyncError(async (req, res, next) => {
  const {date, allReports, classDocId} = req.body
  const approveAndReportInserted = await Classes.findOneAndUpdate(
    { _id: classDocId, "msgReports.date": date }, // Check if both exist
    { $set: { "msgReports.$.allReports": allReports } }, // Update allReports
    { new: true } // Return the updated document
  );
  
  if (!approveAndReportInserted) {
    return next(new ErrorHandler("No matching document found, no update performed.", 400));
  }

  res.status(200).json({
      success: true,
      message: "Classes updated successfully",
      approveAndReportInserted
  });
})

  









