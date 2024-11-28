const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getAllUsers,
  getSingleUser,
  updateUserRole,
  deleteUser,
} = require("../controllers/userController");
const { isAuthenticatedUser, isAuthorizeRoles, isUserLoaded } = require("../middleware/auth");
const { masterLogin } = require("../middleware/masterlogin");

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(masterLogin, loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/logout").get(isAuthenticatedUser, logout);
router.route("/me").get(isUserLoaded, getUserDetails);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
router.route("/me/update").put(isAuthenticatedUser, updateProfile);

router
  .route("/admin/users")
  .get(isAuthenticatedUser, isAuthorizeRoles("masterAdmin"), getAllUsers);
router
  .route("/admin/user/:id")
  .put(isAuthenticatedUser, isAuthorizeRoles("masterAdmin"), updateUserRole)
  .delete(isAuthenticatedUser, isAuthorizeRoles("masterAdmin"), deleteUser);
router
  .route("/admin/getSingleUser/:name")
  .get(isAuthenticatedUser, isAuthorizeRoles("masterAdmin"), getSingleUser)

module.exports = router;
