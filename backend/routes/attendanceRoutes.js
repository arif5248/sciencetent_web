const express = require("express");
const { isAuthenticatedUser, isPermitted } = require("../middleware/auth");
const { createAttendance } = require("../controllers/attendanceController");

const router = express.Router();

router
  .route("/student/createAttendance")  
  .post(isAuthenticatedUser, createAttendance);


module.exports = router;
