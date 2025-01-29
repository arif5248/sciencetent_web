const express = require("express");
const {
  createClass,
  deleteClassNotification,
} = require("../controllers/classController");
const { isAuthenticatedUser, isAuthorizeRoles, isPermitted } = require("../middleware/auth");
const { approvedClass } = require("../utils/approvedClass");
const { setClassForStudents } = require("../utils/setClassForStudents");

const router = express.Router();

// router
//   .route("/admin/class/new")
//   .post(
//     isAuthenticatedUser,
//     isPermitted(process.env.CREATE_CLASS),
//     createClass,
//     approvedClass,
//     setClassForStudents
//   );
router
  .route("/admin/newClass")
  .post(
    isAuthenticatedUser,
    isPermitted(process.env.CREATE_CLASS),
    createClass
  );

module.exports = router;
