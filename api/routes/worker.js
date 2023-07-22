const express = require("express");
const router = express.Router();
const { authorize_delete_staff } = require("../middleware/check-auth");

const workerController = require("../controllers/workers");

router.get("/", workerController.get_workers);
router.get("/:workerId", workerController.get_worker);
router.post("/login", workerController.login_worker);
router.post("/signup", workerController.signup_worker);
router.delete(
  "/:workerId",
  authorize_delete_staff,
  workerController.delete_worker
);

module.exports = router;
