const ErrorHandler = require("../utils/errorhander");
const catchAsyncError = require("../middleware/catchAsyncError");
const ClassNotifiactions = require("../models/classNotificationModel");
const Students = require("../models/studentModel");
const sendSMS = require("../utils/sendSms");

exports.deleteClassNotification = catchAsyncError(async (req, res, next) => {
  await ClassNotifiactions.deleteMany({ status: "approved" });
  res.status(204).json({
    success: true,
    message: "All approved Notifiactiojm are deleted from Database",
  });
});

exports.getPendingClassNotification = catchAsyncError(
  async (req, res, next) => {
    const pendingNotification = await ClassNotifiactions.find({
      status: "pending",
    });
    res.status(200).json({
      success: true,
      pendingNotification,
    });
    if (!pendingNotification) {
      return next(new ErrorHandler("No Pending Notifation is available", 401));
    }
  }
);

exports.getRejectedClassNotification = catchAsyncError(
  async (req, res, next) => {
    const rejectedNotification = await ClassNotifiactions.find({
      status: "rejected",
    });
    res.status(200).json({
      success: true,
      rejectedNotification,
    });

    if (!rejectedNotification) {
      return next(new ErrorHandler("No Rejected Notifation is available", 401));
    }
  }
);

exports.birthdayNotification = async () => {
  try {
    // Get today's date
    const today = new Date();
    const todayMonth = today.getMonth() + 1; // Months are zero-indexed
    const todayDay = today.getDate();

    // Find users with today's birthday
    const usersWithBirthdayToday = await Students.find({
      $expr: {
        $and: [
          { $eq: [{ $month: "$dateOfBirth" }, todayMonth] },
          { $eq: [{ $dayOfMonth: "$dateOfBirth" }, todayDay] },
        ],
      },
    });

    // Send birthday wishes to users
    for (const user of usersWithBirthdayToday) {
      const message = `Dear ${user.name}\nHappy birthday🎉🎂...!!! Wishing you best of luck.\nStay with us \n\nScience Tent\nAn Ultimate Education Care for Science.`;
      await sendSMS({ number: user.whatsappNumber, message });
      console.log(`Birthday wish sent to ${user.name}`);
    }
  } catch (error) {
    console.error("Error sending birthday wishes:", error);
  }
};
