const express = require("express");
const {
  createCourse,
  getAllCourses,
} = require("../controllers/courseController");
const { isAuthenticatedUser, isAuthorizeRoles } = require("../middleware/auth");

const router = express.Router();

router
  .route("/admin/course/new")
  .post(isAuthenticatedUser, isAuthorizeRoles("admin"), createCourse);
router
  .route("/admin/courses")
  .get(isAuthenticatedUser, isAuthorizeRoles("admin"), getAllCourses);

module.exports = router;
