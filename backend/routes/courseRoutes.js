const express = require("express");
const {
  createCourse,
  getAllCourses,
  deleteCourse,
  editCourse,
} = require("../controllers/courseController");
const { isAuthenticatedUser, isAuthorizeRoles, isPermitted } = require("../middleware/auth");

const router = express.Router();

router
  .route("/admin/newCourse")  
  .post(isAuthenticatedUser, isPermitted(process.env.CREATE_COURSE), createCourse);
router
  .route("/admin/courses")
  .get(isAuthenticatedUser, isPermitted(process.env.GET_ALL_COURSE), getAllCourses);
  router
.route("/user/coursesForReg")
  .get(getAllCourses);
router
  .route("/admin/deleteCourse/:id")
  .delete(isAuthenticatedUser, isPermitted(process.env.DELETE_COURSE), deleteCourse );
router
  .route("/admin/editCourse/:id")
  .put(isAuthenticatedUser, isPermitted(process.env.EDIT_COURSE), editCourse);

module.exports = router;
