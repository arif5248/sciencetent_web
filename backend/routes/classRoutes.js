const express = require("express");
const {
  createClass,
  deleteClassNotification,
} = require("../controllers/classController");
const { isAuthenticatedUser, isAuthorizeRoles } = require("../middleware/auth");
const { approvedClass } = require("../utils/approvedeClass");
const { setClassForStudents } = require("../utils/setClassForStudents");

const router = express.Router();

router
  .route("/admin/class/new")
  .post(
    isAuthenticatedUser,
    isAuthorizeRoles("admin"),
    createClass,
    approvedClass,
    setClassForStudents
  );

module.exports = router;
