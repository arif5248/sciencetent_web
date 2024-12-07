const express = require("express");
const { isAuthenticatedUser, isPermitted } = require("../middleware/auth");
const { createExam } = require("../controllers/examController");

const router = express.Router();

router
  .route("/admin/newExam")  
  .post(isAuthenticatedUser, isPermitted(process.env.CREATE_EXAM), createExam);


module.exports = router;
