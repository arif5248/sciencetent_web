const express = require("express");
// const dotenv = require("dotenv");

const {
  createBatch,
  getAllBatches,
  deleteBatch,
  editBatch,
  getAllBatchesForStudents,
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
  .route("/admin/batchesForStudentReg")
  .get(isAuthenticatedUser, getAllBatchesForStudents);
router
  .route("/admin/deleteBatch/:id")
  .delete(isAuthenticatedUser, isPermitted(process.env.DELETE_BATCH), deleteBatch);
router
  .route("/admin/editBatch/:id")
  .put(isAuthenticatedUser, isPermitted(process.env.EDIT_BATCH), editBatch);

module.exports = router;
