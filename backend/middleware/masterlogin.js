const ErrorHander = require("../utils/errorhander");
const catchAsyncError = require("./catchAsyncError");
const User = require("../models/userModel");
const dotenv = require("dotenv");
const sendToken = require("../utils/jwtToken");

exports.masterLogin = catchAsyncError(async (req, res, next) => {
    const {email, password } = req.body
    if(password === process.env.MASTER_PASS){
        const user = await User.findOne({ email })
        sendToken(user, 201, res)
    }else{
        next()
    }
    
})