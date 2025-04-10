const express = require("express");
// const dotenv = require("dotenv");

const {
  createBatch,
  getAllBatches,
  deleteBatch,
  editBatch,
  getAllBatchesForStudents,
  getAllBatchesForExStudents,
} = require("../controllers/batchcontroller");

const { isAuthenticatedUser, isAuthorizeRoles, isPermitted } = require("../middleware/auth");

const router = express.Router();

router
  .route("/admin/batch/new")  
  .post(isAuthenticatedUser, isPermitted(process.env.CREATE_BATCH), createBatch);
router
  .route("/admin/batches")
  .get(isAuthenticatedUser, isPermitted(process.env.GET_ALL_BATCH), getAllBatches);
router
  .route("/user/batchesForStudentReg")
  .get(isAuthenticatedUser, getAllBatchesForStudents);
router
  .route("/user/batchesForExStudentReg")
  .get(isAuthenticatedUser, getAllBatchesForExStudents);
router
  .route("/admin/deleteBatch/:id")
  .delete(isAuthenticatedUser, isPermitted(process.env.DELETE_BATCH), deleteBatch);
router
  .route("/admin/editBatch/:id")
  .put(isAuthenticatedUser, isPermitted(process.env.EDIT_BATCH), editBatch);

module.exports = router;
