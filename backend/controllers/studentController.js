const ErrorHandler = require("../utils/errorhander");
const catchAsyncError = require("../middleware/catchAsyncError");
const Students = require("../models/studentModel");
const Courses = require("../models/courseModel");
const cloudinary = require("cloudinary");

exports.registerStudent = catchAsyncError(async (req, res, next) => {
  const registeredStudent = await Students.find({ user: req.user._id });
  if (registeredStudent.length !== 0) {
    return next(new ErrorHandler("You are already registered for this form", 400));
  }

  let guardianInfo = {};
  let tempImageId;
  const user = req.user.id;
  const {
    name,
    fatherName,
    motherName,
    whatsappNumber,
    dateOfBirth,
    collegeName,
    address,
    batch,
    enrolledCourses,
    guardianName,
    guardianMobile,
    guardianRelationWithStudent,
  } = req.body;

  const enrolledCoursesArray = JSON.parse(enrolledCourses);
  const courseDetails = await Promise.all(
    enrolledCoursesArray.map(async (course) => {
      const courseDetails = await Courses.findById(course.courseID);
      return {
        courseID: courseDetails._id,
        name: courseDetails.name,
      };
    })
  );

  if (req.files && req.files.guardianSignature) {
    const signatureData = req.files.guardianSignature.data;

    const uploadToCloudinary = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream(
          {
            folder: "SignatureOfGuardian",
            width: 200,
            crop: "scale",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        require('stream').Readable.from(buffer).pipe(stream);
      });
    };

    try {
      const myCloud = await uploadToCloudinary(signatureData);
      tempImageId = myCloud.public_id; // Store the public_id to use later for deletion if needed
      guardianInfo = {
        name: guardianName,
        mobile: guardianMobile,
        relationWithStudent: guardianRelationWithStudent,
        signature: {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        },
      };
    } catch (error) {
      return next(new ErrorHandler("Failed to upload guardian signature", 500));
    }
  }

  try {
    // Create student
    const student = await Students.create({
      user,
      name,
      fatherName,
      motherName,
      whatsappNumber,
      dateOfBirth,
      collegeName,
      address,
      batch,
      enrolledCourses: courseDetails,
      guardianInfo,
    });

    res.status(200).json({ success: true, student });
  } catch (error) {
    // If student creation fails, check if the image was uploaded and delete it
    if (tempImageId) {
      try {
        await cloudinary.v2.uploader.destroy(tempImageId);
        console.log(`Image with id ${tempImageId} deleted`);
      } catch (deleteError) {
        console.error("Failed to delete uploaded image from Cloudinary:", deleteError);
      }
    }
    return next(new ErrorHandler(error, 500));
  }
});


exports.getAllStudents = catchAsyncError(async (req, res, next) => {
  const students = await Students.find();

  res.status(200).json({ success: true, students });
});
exports.getAllPendingStudents = catchAsyncError(async (req, res, next) => {
  const students = await Students.find({
    status: "pending",
  });

  res.status(200).json({ success: true, students });
});
exports.getAllApprovedStudents = catchAsyncError(async (req, res, next) => {
  const students = await Students.find({
    status: "approved",
  });

  res.status(200).json({ success: true, students });
});
exports.getAllRejectedStudents = catchAsyncError(async (req, res, next) => {
  const students = await Students.find({
    status: "rejected",
  });

  res.status(200).json({ success: true, students });
});

exports.getAllBatchStudents = catchAsyncError(async (req, res, next) => {
  const students = await Students.find({
    batch: req.params.batchID,
    status: "approved",
  });

  res.status(200).json({ success: true, students });
});

exports.approveStudent = catchAsyncError(async (req, res, next) => {
  const student = await Students.findById(req.params.id);
  if (student.status === "approved") {
    return next(new ErrorHandler("Status is already approved", 400));
  } else {
    const newStatus = {
      status: "approved",
    };

    const approvedStudent = await Students.findByIdAndUpdate(
      student._id,
      newStatus,
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    if (!student) {
      return next(new ErrorHandler("Student not found", 400));
    }

    req.student = approvedStudent;

    next();
  }
});
exports.test = catchAsyncError(async (req, res) => {
  const studentID = req.user.studentRef;
  const student = await Students.findById(studentID);
  console.log("++++==============================", studentID);
  res.status(200).json({ success: true, message: "working", student });
});
