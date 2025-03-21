const express = require("express");
const { isAuthenticatedUser, isPermitted } = require("../middleware/auth");
const { createExam, getAllExamBatchWise, batchWiseMarksInput, getAllExamOptionsBatchWise, getSingleExamDetails, courseWiseMarksInput, modifyExam } = require("../controllers/examController");

const router = express.Router();

router
  .route("/admin/newExam")  
  .post(isAuthenticatedUser, isPermitted(process.env.CREATE_EXAM), createExam);
router
  .route("/admin/modifyExam")  
  .put(isAuthenticatedUser, isPermitted(process.env.MODIFY_EXAM), modifyExam);
router
  .route("/admin/getAllExamBatchWise/:batchId")  
  .get(isAuthenticatedUser, isPermitted(process.env.GET_ALL_EXAM_BATCH_WISE), getAllExamBatchWise);
router
  .route("/admin/getAllExamOptionsBatchWise/:batchId")  
  .get(isAuthenticatedUser, getAllExamOptionsBatchWise);
// router
//   .route("/admin/bachWiseMarksInput/:examId")  
//   .put(isAuthenticatedUser, isPermitted(process.env.MARKS_INPUT_BATCH_WISE), batchWiseMarksInput);
router
  .route("/admin/courseWiseMarksInput")  
  .put(isAuthenticatedUser, isPermitted(process.env.MARKS_INPUT_COURSE_WISE), courseWiseMarksInput);
  router
.route("/admin/getSingleExamDetails/:id")
  .get(isAuthenticatedUser, isPermitted(process.env.Get_Single_Exam_Details), getSingleExamDetails)


module.exports = router;
