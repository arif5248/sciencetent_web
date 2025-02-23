const express = require("express");
const { isAuthenticatedUser } = require("../middleware/auth");
const { createOtpForExStudentVerification } = require("../controllers/otpController");
const router = express.Router();

router.route("/createOtp").post(isAuthenticatedUser, createOtpForExStudentVerification)

module.exports = router;