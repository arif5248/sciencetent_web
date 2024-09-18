const express = require("express");
const {
  registerStudent,
  getAllStudents,
  approveStudent,
  getAllPendingStudents,
  getAllApprovedStudents,
  getAllRejectedStudents,
  test,
  getAllBatchStudents,
} = require("../controllers/studentController");
const { isAuthenticatedUser, isAuthorizeRoles, isPermitted } = require("../middleware/auth");
const { generateUniqueID } = require("../utils/generateUniqueID");
const router = express.Router();

router.route("/student/register").post(isAuthenticatedUser, registerStudent);
router
  .route("/admin/students")
  .get(isAuthenticatedUser, isPermitted(process.env.GET_ALL_STUDENTS), getAllStudents);
router
  .route("/admin/pending-students")
  .get(isAuthenticatedUser, isPermitted(process.env.GET_ALL_PENDING_STUDENTS), getAllPendingStudents);
router
  .route("/admin/approved-students")
  .get(isAuthenticatedUser, isPermitted(process.env.GET_ALL_APPROVED_STUDENTS), getAllApprovedStudents);
router
  .route("/admin/rejected-students")
  .get(isAuthenticatedUser, isPermitted(process.env.GET_ALL_REJECTED_STUDENTS), getAllRejectedStudents);
router
  .route("/admin/batch-students/:batchID")
  .get(isAuthenticatedUser, isPermitted(process.env.GET_ALL_BATCH_STUDENTS), getAllBatchStudents);
router
  .route("/admin/approve/students/:id")
  .put(
    isAuthenticatedUser,
    isPermitted(process.env.APPROVE_STUDENT),
    approveStudent,
    generateUniqueID
  );



module.exports = router;
