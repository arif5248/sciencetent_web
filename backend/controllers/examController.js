const ErrorHandler = require("../utils/errorhander");
const catchAsyncError = require("../middleware/catchAsyncError");
const Exam = require("../models/examModel");

exports.createExam = async (req, res) => {
    console.log("======================")
    console.log(req.body)
    console.log("======================")
    try {
      const { date, time, totalMarks, courses, batchName, assignedGuard } = req.body;
  
      // Validate input
      if (!date || !time || !totalMarks || !courses || !batchName || !assignedGuard) {
        return res.status(400).json({ success: false, message: "All fields are required." });
      }
  
      // Create the exam document
      const exam = await Exam.create({
        date,
        time,
        totalMarks,
        courses,
        batchName,
        assignedGuard,
        createdBy: {
          user: req.user._id, // Assumes `req.user` contains the authenticated user's details
          name: req.user.name,
        },
      });
  
      res.status(201).json({ success: true, message: "Exam created successfully.", exam });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server error. Please try again later." });
    }
  };