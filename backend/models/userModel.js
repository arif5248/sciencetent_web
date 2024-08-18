const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter your Name"],
    maxLength: [30, "Name cna not excced 30 charaters"],
    minLength: [2, "Name should have more then 2 characters long"],
  },
  email: {
    type: String,
    required: [true, "Please Enter your Email"],
    unique: true,
    validate: [validator.isEmail, "Please Enter a valid Email"],
  },
  mobile: {
    mobileNumber: {
      type: String,
      validate: {
        validator: function (v) {
          // Validate only if mobileNumber is provided
          return !v || /\d{11}/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
      default: "", // Allow mobileNumber to be empty or null
    },
    isApproved: {
      type: String,
      default: "pending",
      enum: ["pending", "approved"],
    },
  },
  
  
  password: {
    type: String,
    required: [true, "Please Enter your Password"],
    minLength: [6, "Password should have more then 6 characters long"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      default: "",
    },
    url: {
      type: String,
      default: "",
    },
  },
  studentRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Students",
  },
  role: {
    type: String,
    default: "user",
    enum: ["masterAdmin", "admin", "moderator", "user", "student", "teacher", "exStudent"],
  },
  permissions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Permissions',
  }], 
  batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Batches",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPaswordExpire: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

//jwt token
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

//compare pasword
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//Generaing Pasword Reset Token
userSchema.methods.getResetPasswordToken = function () {
  //Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  //Hashing and adding resetPasswordToken to userSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPaswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};
// partial index for the mobile number
// userSchema.index(
//   { "mobile.mobileNumber": 1 },
//   {
//     unique: true,
//     partialFilterExpression: { "mobile.mobileNumber": { $exists: true, $ne: "" } },
//   }
// );

module.exports = mongoose.model("Users", userSchema);
