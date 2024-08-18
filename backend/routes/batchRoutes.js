const express = require("express");
// const dotenv = require("dotenv");

const {
  createBatch,
  getAllBatches,
} = require("../controllers/batchcontroller");

const { isAuthenticatedUser, isAuthorizeRoles, isPermitted } = require("../middleware/auth");

const router = express.Router();

router
  .route("/admin/batch/new")  
  .post(isAuthenticatedUser, isPermitted(process.env.CREATE_BATCH), createBatch);
router
  .route("/admin/batches")
  .get(isAuthenticatedUser, isPermitted(process.env.GET_ALL_BATCH), getAllBatches);

module.exports = router;
