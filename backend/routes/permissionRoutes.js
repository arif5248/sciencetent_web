const express = require("express");
const { isAuthenticatedUser, isAuthorizeRoles } = require("../middleware/auth");
const {createPermission, getAllPermissions, assignPermission} = require("../controllers/permissionController")


const router = express.Router();

router
  .route("/masterAdmin/permission/new")
  .post(isAuthenticatedUser, isAuthorizeRoles("masterAdmin"), createPermission );
router
  .route("/masterAdmin/permissions")
  .get(isAuthenticatedUser, isAuthorizeRoles("masterAdmin"), getAllPermissions);
router
  .route("/masterAdmin/permission/assign")
  .put(isAuthenticatedUser, isAuthorizeRoles("masterAdmin"), assignPermission )

module.exports = router;
