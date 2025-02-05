const express = require("express");
const {
  createClass,
  deleteClassNotification,
  getPendingClassesGroupedByDate,
  pendingClassToApprove,
  pendingClassToCancel,
  updateClassMessageReport,
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

router
  .route("/admin/getPendingClassesGroupedByDate")
  .get(
    isAuthenticatedUser,
    isPermitted(process.env.Get_Pending_Classes_Grouped_By_Date),
    getPendingClassesGroupedByDate
  );

router
  .route("/admin/pendingClassesToApprove")
  .put(
    isAuthenticatedUser,
    isPermitted(process.env.Pending_Classes_To_Approve),
    pendingClassToApprove
  );
router
  .route("/admin/pendingClassesToCancel")
  .put(
    isAuthenticatedUser,
    isPermitted(process.env.Pending_Classes_To_Cancel),
    pendingClassToCancel
  );
router
  .route("/admin/updateClassMessageReport")
  .put(
    isAuthenticatedUser,
    updateClassMessageReport
  );

module.exports = router;
