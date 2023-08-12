const express = require("express");
const router = express.Router();
const { authorize_handle_auth } = require("../middleware/check-for-auth");

const workerController = require("../controllers/workers");

router.get("/", workerController.get_workers);
router.get("/:workerId", workerController.get_worker);
router.post("/login", workerController.login_worker);
router.post("/signup", workerController.signup_worker);
router.delete(
  "/:workerId",
  authorize_handle_auth,
  workerController.delete_worker
);

module.exports = router;
