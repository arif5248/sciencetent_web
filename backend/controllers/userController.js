const ErrorHandler = require("../utils/errorhander");
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail.js");
const crypto = require("crypto");
const cloudinary = require("cloudinary");
// const { send } = require("process");

//Register a User
exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password, mobile } = req.body;

  if(mobile){
    const existUser = await User.findOne({ "mobile.mobileNumber": mobile.mobileNumber})
    console.log(mobile.mobileNumber)
    if(existUser){
      return next(new ErrorHandler("This mobile is already used. Try another one", 401));
    }
  }
  const user = await User.create({
    name,
    email,
    password,
    mobile
  });
  sendToken(user, 201, res);
});

//Login User
exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid Email & Password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email & Password", 401));
  }

  sendToken(user, 200, res);
});

//Logout
exports.logout = catchAsyncError(async (req, res, next) => {
  // Set the expiration date to a time in the past to delete the cookie
  const options = {
    expires: new Date(
      Date.now() - 10*60*1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "development", // Should be true for HTTPS
    sameSite: process.env.NODE_ENV === "development" ? "None" : "Lax",
    path: "/"
  };

  res
    .status(200)
    .cookie("token", null, options) // Set cookie with null value and past expiration
    .json({ success: true, message: "Logged Out" });
});



//forgot password
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  //Get ResetPassword Token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // const protocol = req.protocol; // 'http' or 'https'
  const host = req.get('origin') || req.get('referrer');  
  const resetUrl = `${host}/password/reset/${resetToken}`;

  const message = `Your password reset url is :- \n\n\n ${resetUrl} \n\n if you have not request this email then, please ignore it`;
  
  try {
    await sendEmail({
      email: req.body.email,
      subject: `Reset password URL`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

//Reset password
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset Password link is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password doesn't matched", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordToken = undefined;

  await user.save();
  sendToken(user, 200, res);
});

//Get User Details
exports.getUserDetails = catchAsyncError(async (req, res, next) => {
  if(req.user === null){
    res.status(200).json({ success: false, message:"No logged in user ", user: null });
  }else{
    const user = req.user;
    res.status(200).json({ success: true, user });
  }
  
});

//Update password
exports.updatePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old Password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password doesn't matched", 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});

//Update User Profile
exports.updateProfile = catchAsyncError(async (req, res, next) => {
  console.log(req)
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };
  
  if (req.files && req.files.avatar) {
    const avatarData = req.files.avatar.data;

    if (req.user.avatar !== "") {
      // const user = await User.findById(req.user.id);
      const imageId = req.user.avatar.public_id;

      // Helper function to handle the Cloudinary upload
      const uploadToCloudinary = (buffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.v2.uploader.upload_stream(
            {
              folder: "avatars",
              width: 150,
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

      // If the user already has an avatar, delete the existing one
      if (imageId !== "") {
        await cloudinary.v2.uploader.destroy(imageId);
      }

      // Upload the new avatar
      const myCloud = await uploadToCloudinary(avatarData);
      
      newUserData.avatar = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({ success: true, user });
});



//Get All Users(admin)
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({ success: true, users });
});

//Get Single Users(admin)
exports.getSingleUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({"name": req.params.name});
  if (!user) {
    return next(
      new ErrorHandler(`User doesn't exist with Name: ${req.params.name}`, 400)
    );
  }
  res.status(200).json({ success: true, user });
});

//Update User Role ---Admin
exports.updateUserRole = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({ success: true });
});

//Delete User ---Admin
exports.deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User doesn't exist with Id: ${req.params.id}`, 400)
    );
  }

  await user.deleteOne();
  res.status(200).json({ success: true, message: "User Deleted Successfully" });
});
