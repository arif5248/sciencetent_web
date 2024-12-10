const express = require("express");
const { isAuthenticatedUser, isPermitted } = require("../middleware/auth");
const { createExam, getAllExamBatchWise } = require("../controllers/examController");

const router = express.Router();

router
  .route("/admin/newExam")  
  .post(isAuthenticatedUser, isPermitted(process.env.CREATE_EXAM), createExam);
router
  .route("/admin/getAllExamBatchWise/:batchId")  
  .get(isAuthenticatedUser, isPermitted(process.env.GET_ALL_EXAM_BATCH_WISE), getAllExamBatchWise);
router
  .route("/admin/bachWiseMarksInput/:examId")  
  .put(isAuthenticatedUser, isPermitted(process.env.MARKS_INPUT_BATCH_WISE), batchWiseMarksInput);


module.exports = router;
