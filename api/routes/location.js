const express = require("express");
const router = express.Router();

const {
  get_locations,
  get_location,
  create_or_edit_location,
  delete_location,
} = require("../controllers/locations");
const {
  authorize_handle_auth,
  authorize_only_workers,
} = require("../middleware/check-for-auth");

router.get("/", authorize_only_workers, get_locations);
router.get("/:locId", authorize_only_workers, get_location);
router.patch("/", create_or_edit_location);
router.delete("/:locId", authorize_handle_auth, delete_location);

module.exports = router;
