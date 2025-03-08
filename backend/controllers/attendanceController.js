const ErrorHandler = require("../utils/errorhander");
const catchAsyncError = require("../middleware/catchAsyncError");
const Attendance = require("../models/attendanceModel");
const Classes = require("../models/classModel");
const Batches = require("../models/batchModel");
const moment = require("moment");

exports.createAttendance = catchAsyncError(async (req, res, next) => {
    const { student, name, studentId, batch, Time } = req.body;
    const monthAndYear = moment().format("YYYY-MM");
    const currentDate = moment().format("YYYY-MM-DD");

    // Check if attendance record exists for the student in the given month
    let attendance = await Attendance.findOne({ student, monthAndYear });
    console.log("====attendance===", attendance)
    // Fetch class schedule for the batch on the current date
    const classSchedule = await Classes.findOne({ batch, monthAndYear, "classes.date": currentDate });
    console.log("====classSchedule===", classSchedule)

    if (!classSchedule) {
        return next(new ErrorHandler("No class today.", 400));
    }

    // Get today's class details
    const todayClass = classSchedule.classes.find(cls => moment(cls.date).isSame(currentDate, 'day'));
    if (!todayClass) {
        return next(new ErrorHandler("No class scheduled for today.", 400));
    }

    // Check if the student scanned more than 30 minutes before class
    const scanTime = moment(Time, "hh:mma");
    const classStartTime = moment(todayClass.startingTime, "hh:mma");
    if (scanTime.isBefore(classStartTime.subtract(30, 'minutes'))) {
        return next(new ErrorHandler("Please scan within 30 minutes of class start time.", 400));
    }

    if (!attendance) {
        // Create a new attendance record if not exists
        attendance = new Attendance({
            student,
            studentName: name,
            studentId,
            batch,
            monthAndYear,
            Records: [
                {
                    date: currentDate,
                    clockIn: Time,
                    attendanceData: todayClass.classes.map(cls => ({
                        courseId: cls.courseId,
                        courseName: cls.courseName,
                        attendanceStatus: "present"
                    }))
                }
            ]
        });
    } else {
        // Update existing record
        const todayRecord = attendance.Records.find(r => moment(r.date).isSame(currentDate, 'day'));
        if (!todayRecord) {
            attendance.Records.push({
                date: currentDate,
                clockIn: Time,
                attendanceData: todayClass.classes.map(cls => ({
                    courseId: cls.courseId,
                    courseName: cls.courseName,
                    attendanceStatus: "present"
                }))
            });
        } else {
            // Modify clockOut and check early leave
            todayRecord.clockOut = Time;
            const lastClassEndTime = moment(todayClass.finishingTime, "hh:mma");
            if (scanTime.isBefore(lastClassEndTime)) {
                todayRecord.attendanceData.forEach(record => record.attendanceStatus = "earlyLeave");
            }
        }
    }

    await attendance.save();
    res.status(200).json({ success: true, message: `Thank You ${name}. Attendance updated successfully.` });
});
