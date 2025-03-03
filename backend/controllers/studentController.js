const ErrorHandler = require("../utils/errorhander");
const catchAsyncError = require("../middleware/catchAsyncError");
const Students = require("../models/studentModel");
const Users = require("../models/userModel");
const Batches = require("../models/batchModel");
const Courses = require("../models/courseModel");
const Otp = require('../models/otpModel')
const cloudinary = require("cloudinary")
const mongoose = require('mongoose');
const sendSMS = require("../utils/sendSms");

exports.registerStudent = catchAsyncError(async (req, res, next) => {
  const registeredStudent = await Students.findOne({ user: req.user._id });
  // console.log("======++++++++++++=======",registeredStudent)
  if(registeredStudent && (registeredStudent.status === 'pending' || registeredStudent.status === 'approved')){
    return next(new ErrorHandler("You are already registered for this form. Please wait for the Admin's Approval.\n Thank You", 400));
    // console.log("======++++++++++++=======",isDeleted)
  }else {
    if(registeredStudent && registeredStudent.status === 'rejected'){
      const isDeleted = await Students.findByIdAndDelete(registeredStudent._id)
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
      admissionFeeRef
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

    const getBatch = await Batches.findById(batch)
    if(!getBatch){
      return next(new ErrorHandler("Failed to get batch", 500));
    }
    const batchDetails = {
      batchId : getBatch._id,
      batchCode : getBatch.batchCode
    }

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
  // const status = req.body.status ? req.body.status : 'pending'

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
      batchDetails,
      enrolledCourses: courseDetails,
      guardianInfo,
      admissionFeeRef,
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
  }}
});

exports.exRegisterStudent = catchAsyncError(async (req, res, next) => {
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
    const user = req.user.id;
    const registeredStudent = await Students.findOne({ user: req.user._id });
    if(registeredStudent && (registeredStudent.status === 'pending' || registeredStudent.status === 'approved')){
      return next(new ErrorHandler("You are already registered for this form. Please Reload the tab. Thank You", 400));
    }
    const {
      name,
      fatherName,
      motherName,
      whatsappNumber,
      dateOfBirth,
      address,
      batch,
      enrolledCourses,
      otp
    } = req.body;

    const pendingOtp = await Otp.findOne({ userId: req.user.id, otpStatus: "pending",createdAt: { $gte: twoMinutesAgo }  });
    console.log(pendingOtp)
    console.log("pendingOtp.otp", pendingOtp.otp, "==============", "otp", otp)

    if(!pendingOtp || pendingOtp.otp !== otp){
      return next(new ErrorHandler("Otp Expired or not matched. Please try again", 500));
    }
  
    let admissionFeeRef = "N/A"
    let collegeName = "N/A"
    let guardianInfo = {
      name: "N/A",
      mobile: "01000000000",
      relationWithStudent: "N/A",
      signature: {
        public_id: "N/A",
        url:"N/A",
      },
    };
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

    const getBatch = await Batches.findById(batch)
    if(!getBatch){
      return next(new ErrorHandler("Failed to get batch", 500));
    }
    const batchDetails = {
      batchId : getBatch._id,
      batchCode : getBatch.batchCode
    }

  const status = "approved"

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
      batchDetails,
      enrolledCourses: courseDetails,
      guardianInfo,
      admissionFeeRef,
      status
    });

    const setStudentRef = {
      studentRef: student._id,
    };

    const updatedUser = await Users.findByIdAndUpdate(
      user,
      setStudentRef,
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    )
    if(!updatedUser){
      return next(new ErrorHandler("Student Ref in User model is not updated. Please Try Again", 500));
    }

    res.status(200).json({ success: true, student });
  } catch (error) {
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
    "batchDetails.batchId": req.params.batchID,
    status: "approved",
  });

  res.status(200).json({ success: true, students });
});

exports.approveStudent = catchAsyncError(async (req, res, next) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const student = await Students.findById(req.params.id).session(session);
    if (student.status === "approved") {
      return next(new ErrorHandler("Status is already approved", 400));
    } else {
      // const newStatus = {
      //   status: "approved",
      // };

      // const approvedStudent = await Students.findByIdAndUpdate(
      //   student._id,
      //   newStatus,
      //   {
      //     new: true,
      //     runValidators: true,
      //     useFindAndModify: false,
      //   }
      // ).session(session);

    if (!student) {
      return next(new ErrorHandler("Student not found", 400));
    }

    req.student = student;
    req.session = session
    next();
  }
  } catch (error) {
    console.error(error)
    await session.abortTransaction()
    session.endSession()
    res.status(500).json({ success: false, message: 'Student Approve failed' })
  
  }
  
});
exports.rejectStudent = catchAsyncError(async (req, res, next) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    let student = await Students.findById(req.params.id).session(session);
    if (!student) {
      return next(new ErrorHandler("Student not found", 400));
    }
    if (student.status === "rejected") {
      return next(new ErrorHandler("Status is already rejected", 400));
    } else {
      const newStatus = {
        status: "rejected",
      };

       student = await Students.findByIdAndUpdate(
        student._id,
        newStatus,
        {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        }
      ).session(session);

      await sendSMS({
        number: student.whatsappNumber,
        message: `Dear ${student.name}, Your Registration is Rejected. ${req.body.note}. For more details contact with Admin. From: Science Tent`,
      });
  
      await session.commitTransaction()
      session.endSession()
  
      res.status(200).json({ success: true, message:"Successfully rejected", student });

  }
  } catch (error) {
    console.error(error)
    await session.abortTransaction()
    session.endSession()
    res.status(500).json({ success: false, message: 'Student Reject failed' })
  
  }
  
});
exports.test = catchAsyncError(async (req, res) => {
  const studentID = req.user.studentRef;
  const student = await Students.findById(studentID);
  console.log("++++==============================", studentID);
  res.status(200).json({ success: true, message: "working", student });
});
