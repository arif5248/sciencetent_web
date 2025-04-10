const ErrorHandler = require("../utils/errorhander");
const catchAsyncError = require("../middleware/catchAsyncError");
const ClassNotifications = require("../models/classNotificationModel");
const Students = require("../models/studentModel");
const sendSMS = require("../utils/sendSms");
const sendEmail = require("../utils/sendEmail");

exports.deleteClassNotification = catchAsyncError(async (req, res, next) => {
  await ClassNotifications.deleteMany({ status: "approved" });
  res.status(204).json({
    success: true,
    message: "All approved Notification are deleted from Database",
  });
});

exports.getPendingClassNotification = catchAsyncError(
  async (req, res, next) => {
    const pendingNotification = await ClassNotifications.find({
      status: "pending",
    });
    res.status(200).json({
      success: true,
      pendingNotification,
    });
    if (!pendingNotification) {
      return next(new ErrorHandler("No Pending Notification is available", 401));
    }
  }
);

exports.getRejectedClassNotification = catchAsyncError(
  async (req, res, next) => {
    const rejectedNotification = await ClassNotifications.find({
      status: "rejected",
    });
    res.status(200).json({
      success: true,
      rejectedNotification,
    });

    if (!rejectedNotification) {
      return next(new ErrorHandler("No Rejected Notification is available", 401));
    }
  }
);


// exports.birthdayNotification = async (req, res, next) => {
//     // Get today's date
//     const today = new Date();
//     const todayMonth = today.getMonth() + 1; // Months are zero-indexed
//     const todayDay = today.getDate();

//     // Find users with today's birthday
//     const usersWithBirthdayToday = await Students.find({
//       $expr: {
//         $and: [
//           { $eq: [{ $month: "$dateOfBirth" }, todayMonth] },
//           { $eq: [{ $dayOfMonth: "$dateOfBirth" }, todayDay] },
//         ],
//       },
//     });
    

//     const usersWithBirthdayToday = [
//       {
//         name: "arif",
//         whatsappNumber: "01825269227",
//       },
//       {
//         name: "Tasi",
//         whatsappNumber: "01825269227",
//       },
//       {
//         name: "Mrs Fish",
//         whatsappNumber: "01825269227",
//       },
//     ];


//     if (usersWithBirthdayToday.length === 0) {
//       console.log("No birthdays today.");
//       res.status(200).json({ success: true, message:"No Birthday today" });
//     }else{
//       console.log(`${usersWithBirthdayToday.length} birthday(s) found today.`);

//       // Initialize index to keep track of current user
//       let index = 0;
  
//       // Set up interval to send SMS every 3 seconds
//       const intervalId = setInterval(async () => {
//         if (index >= usersWithBirthdayToday.length) {
//           // Stop the interval once all users have been processed
//           clearInterval(intervalId);
//           console.log("All birthday notifications sent successfully.");
//           return;
//         }
  
//         // Send SMS to the current user
//         const user = usersWithBirthdayToday[index];
//         // const message = `Dear ${user.name}\nHappy birthday🎉🎂...!!! Wishing you best of luck.\nStay with us \n\nScience Tent\nAn Ultimate Education Care for Science.`;
//         const message = `Dear ${user.name}\nHappy birthday🎉🎂...!!! `
  
//         await sendSMS({ number: user.whatsappNumber, message });
//         console.log(`Birthday wish sent to ${user.name}`);
  
//         // Move to the next user
//         index++;
//       }, 3000); // 3 seconds interval
//       res.status(200).json({ success: true, message:`${usersWithBirthdayToday.length} birthday(s) found today.` });
//     }

    
// };


exports.birthdayNotification = async (req, res, next) => {
  // Get today's date in Bangladesh time (UTC+6)
  const today = new Date();
  const bangladeshOffset = 6 * 60 * 60 * 1000; // Offset in milliseconds
  const bangladeshTime = new Date(today.getTime() + bangladeshOffset);

  const todayMonth = bangladeshTime.getMonth() + 1; // Months are zero-indexed
  const todayDay = bangladeshTime.getDate();

  try {
    // Find users with today's birthday
    const usersWithBirthdayToday = await Students.find({
      $expr: {
        $and: [
          { $eq: [{ $month: { $toDate: "$dateOfBirth" } }, todayMonth] },
          { $eq: [{ $dayOfMonth: { $toDate: "$dateOfBirth" } }, todayDay] },
        ],
      },
    });

    console.log("Users with birthdays today:", usersWithBirthdayToday);

    if (usersWithBirthdayToday.length === 0) {
      console.log("No birthdays today.");
      await sendEmail({
        email: "arifislam11ctg@gmail.com",
        subject: `Birthday Alert`,
        message: "No Birthday today",
      });
      return res.status(200).json({ success: true, message: "No Birthday today" });
    }

    // Compose email message
    let emailMessage = `Today's Birthdays:\n`;
    const promises = usersWithBirthdayToday.map((user) => {
      emailMessage += `name: ${user.name}. Batch: ${user.batchDetails.batchCode}\n`;
      const message = `Dear ${user.name}\nHappy birthday🎉🎂...!!! Wishing you best of luck.\nStay with us \n\nScience Tent\nAn Ultimate Education Care for Science.`;
      return sendSMS({ number: user.whatsappNumber, message });
    });

    await Promise.all(promises);

    // Send summary email
    await sendEmail({
      email: "arifislam11ctg@gmail.com",
      subject: `Birthday Alert`,
      message: emailMessage,
    });

    res.status(200).json({
      success: true,
      message: `${usersWithBirthdayToday.length} birthday(s) notifications sent.`,
    });
  } catch (error) {
    console.error("Error sending birthday notifications:", error);
    res.status(500).json({ success: false, message: "Failed to send notifications." });
  }
};

exports.sendMessage = catchAsyncError( async (req, res, next) => {
  const {toNumber, message}= req.body
  const messageReport = await sendSMS({number: toNumber, message})
  if(messageReport[0].status === 'SENT'){
    res.status(200).json({ success: true, messageReport });
  }else{
    res.status(500).json({ success: false, messageReport });
  }
})




