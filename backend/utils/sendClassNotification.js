const ErrorHandler = require("./errorhander");
const catchAsyncError = require("../middleware/catchAsyncError");
const ClassNotification = require("../models/classNotificationModel");
const sendSMS = require("./sendSms");

exports.sendClassNotification = catchAsyncError(async (req, res, next) => {
  try {
    const getStudents = await ClassNotification.find({
      status: "pending",
    });
    if (!getStudents || getStudents.length === 0)
      return next(
        new ErrorHandler("No pending student is available to send SMS", 500)
      );
    const processStudent = async (student) => {
      const mobileNumber = student.mobileNumber;
      const subjects = student.subject;

      const data = subjects
        .map((subject) => {
          return `${subject.subjectName}: ${subject.startingTime} - ${subject.finishingTime}`;
        })
        .join("\n");

      try {
        const jsonData = await sendSMS({
          number: mobileNumber,
          message: `Dear ${student.studentName}\nNext Class( ${student.date} )\n${data}\n\nScience Tent( ${student.branch} )`,
        });

        const result = jsonData[0].status;

        let updateStatus;
        if (result === "SENT") {
          updateStatus = await ClassNotification.findByIdAndUpdate(
            student._id,
            { status: "approved" },
            {
              new: true,
              runValidators: true,
              useFindAndModify: false,
            }
          );
        } else {
          updateStatus = await ClassNotification.findByIdAndUpdate(
            student._id,
            { status: "rejected" },
            {
              new: true,
              runValidators: true,
              useFindAndModify: false,
            }
          );
        }

        if (!updateStatus) {
          return next(
            new ErrorHandler("Failed to update status for student:", 500)
          );
        }
      } catch (error) {
        console.error(error);
      }
    };

    for (const student of getStudents) {
      await processStudent(student);
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
  next();
});
