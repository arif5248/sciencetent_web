const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a Permission Name"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [2, "Name should be at least 2 characters long"],
  },
  permissionCode: {
    type: String,
    default: "Not Set",
  },
  createdBy: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Permissions", permissionSchema);
