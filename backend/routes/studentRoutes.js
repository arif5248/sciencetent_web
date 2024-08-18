const express = require("express");
const {
  registerStudent,
  getAllStudents,
  approveStudent,
  getAllPendingStudents,
  getAllApprovedStudents,
  getAllRejectedStudents,
  test,
} = require("../controllers/studentController");
const { isAuthenticatedUser, isAuthorizeRoles } = require("../middleware/auth");
const { generateUniqueID } = require("../utils/generateUniqueID");

const router = express.Router();

router.route("/student/register").post(isAuthenticatedUser, registerStudent);
router
  .route("/admin/students")
  .get(isAuthenticatedUser, isAuthorizeRoles("admin"), getAllStudents);
router
  .route("/admin/pending-students")
  .get(isAuthenticatedUser, isAuthorizeRoles("admin"), getAllPendingStudents);
router
  .route("/admin/approved-students")
  .get(isAuthenticatedUser, isAuthorizeRoles("admin"), getAllApprovedStudents);
router
  .route("/admin/rejected-students")
  .get(isAuthenticatedUser, isAuthorizeRoles("admin"), getAllRejectedStudents);
router
  .route("/admin/batch-students/:batchID")
  .get(isAuthenticatedUser, isAuthorizeRoles("admin"), getAllRejectedStudents);
router
  .route("/admin/approve/students/:id")
  .put(
    isAuthenticatedUser,
    isAuthorizeRoles("admin"),
    approveStudent,
    generateUniqueID
  );

router.route("/test").get(isAuthenticatedUser, test);

module.exports = router;
