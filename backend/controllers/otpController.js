const ErrorHandler = require("../utils/errorhander");
const catchAsyncError = require("../middleware/catchAsyncError");
const Otp = require("../models/otpModel");
const sendEmail = require("../utils/sendEmail");
const sendSMS = require("../utils/sendSms");

exports.createOtpForExStudentVerification = catchAsyncError(async (req, res, next) => {
    const {sms, toNumber} = req.body
    const countOtp = await Otp.countDocuments({ userId: req.user.id, });

    if (countOtp >= 3) {
        return next(new ErrorHandler("You have already requested 3 OTPs. Please try again later or contact with Admin", 400));
    }
    const pendingOtp = await Otp.countDocuments({ userId: req.user.id, otpStatus: "pending",});
    if (pendingOtp) {
        return next(new ErrorHandler("You have already requested for an OTP. Please try after 2 Minutes", 400));
    }

    // Generate OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

    // Save OTP to database
    const otp = await Otp.create({
        userId: req.user.id,
        otp: otpCode,
        otpStatus: "pending",
    });
    if(!otp){
        return next(new ErrorHandler("Failed to create otp",400))
    }
    const message = `Your One time password (OTP) for Registration verification is ${otp.otp}. validity is 2 minutes.\nFor any help contact with Admin\nScience Tent.\nAn Ultimate Education Care of Science.`

    if(sms){
        function maskMobileNumber(mobileNumber) {
            return mobileNumber.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2");
        }
        const messageReport = await sendSMS({number: toNumber, message})
        if(messageReport[0].status === 'SENT'){
            res.status(201).json({
                success: true,
                message: `OTP sent successfully to ${maskMobileNumber(toNumber)}`,
            });
        }else{
            res.status(500).json({ success: false, message:"Failed to sent message. Please try again" });
        }
    }else{
        const emailReport = await sendEmail({
            email: req.user.email,
            subject: `Otp for Verification`,
            message,
        });
        console.log(emailReport)
        res.status(201).json({
            success: true,
            message: `OTP sent successfully to ${req.user.email}`,
            emailReport
        });
    }

    
});