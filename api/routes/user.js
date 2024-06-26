const express = require("express");
const router = express.Router();
const { authorize_delete_users } = require("../middleware/check-auth");

const userController = require("../controllers/users");

router.get("/", userController.get_users);
router.get("/:userId", userController.get_user);
router.post("/login", userController.login_users);
router.post("/signup", userController.signup_users);
router.post("/google-login", userController.google_login);
router.get("/user/:id/verify/:token", userController.confirm_email);
router.post("/password-reset/", userController.req_reset_password);
router.post("/new-password/", userController.reset_password);
router.delete("/:userId", authorize_delete_users, userController.delete_users);

module.exports = router;
