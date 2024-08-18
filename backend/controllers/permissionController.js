const ErrorHandler = require("../utils/errorhander");
const catchAsyncError = require("../middleware/catchAsyncError");
const Permissions = require("../models/permissionModel");
const User = require("../models/userModel");

exports.createPermission = catchAsyncError(async (req, res) => {
  req.body.createdBy = {
    user: req.user.id,
    name: req.user.name,
  };
  const permission = await Permissions.create(req.body);

  res.status(201).json({ success: true, permission });
});
exports.getAllPermissions = catchAsyncError(async (req, res, next) => {
  const permissions = await Permissions.find();

  res.status(200).json({ success: true, permissions });
});
exports.assignPermission = catchAsyncError(async (req, res, next) => {
    const { userId, permissionIds } = req.body
    // const user = await User.findById(userId);
    
    const user = await User.findByIdAndUpdate(
        userId,
        { permissions:  permissionIds }  ,
        {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        } // Return the updated document
    );
    if (!user) {
        return next(new ErrorHandler("User not found.", 401));
    }
    res.status(200).json({ success: true, message:"Permission assigned successfully", user });
});