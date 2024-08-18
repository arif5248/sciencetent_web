const express = require("express");

const { isAuthenticatedUser, isAuthorizeRoles } = require("../middleware/auth");
const { sendClassNotification } = require("../utils/sendClassNotification");
const {
  deleteClassNotification,
  getPendingClassNotification,
  getRejectedClassNotification,
} = require("../controllers/notifiactionController");

const router = express.Router();

router
  .route("/admin/send-class-noti")
  .delete(
    isAuthenticatedUser,
    isAuthorizeRoles("admin"),
    sendClassNotification,
    deleteClassNotification
  );

router
  .route("/admin/pending-noti")
  .get(
    isAuthenticatedUser,
    isAuthorizeRoles("admin"),
    getPendingClassNotification
  );

router
  .route("/admin/rejected-noti")
  .get(
    isAuthenticatedUser,
    isAuthorizeRoles("admin"),
    getRejectedClassNotification
  );

module.exports = router;
