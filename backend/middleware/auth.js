const ErrorHandler = require("../utils/errorhander");
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Permission = require("../models/permissionModel");
const { updatePassword } = require("../controllers/userController");

exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Please Login to access this resource", 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decodedData.id);
  if(req.user === null){
    return next(new ErrorHandler("User not found. Please Login first", 401));
  }
  next();
});
exports.isUserLoaded = catchAsyncError(async (req, res, next) => {

  if (!token) {
    // return next(new ErrorHandler("Please Login to access this resource", 401));
    req.user = null;
    next()
  }else{
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);
    next();
  }
});

exports.isAuthorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not allowed to access this resource`,
          403
        )
      );
    }

    next();
  };
};

exports.isPermitted =  (permissionCode) => {
  return catchAsyncError(async (req, res, next) => {
    if(req.user.role === "masterAdmin"){
      next()
    }else{
      console.log(permissionCode,"=======permission code========")
      const existPermission = await Permission.findOne({"permissionCode": permissionCode})
      if(!existPermission){
        return next(new ErrorHandler("Permission not found", 401));
      }
      if(req.user.permissions.includes(existPermission._id)){
        next()
      }else{
        return next(new ErrorHandler("You don't have permission to access this", 401));
      }
    }
    
  })
} 
