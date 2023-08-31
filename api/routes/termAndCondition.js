const express = require("express");
const router = express.Router();

const {
  get_terms_and_conditions,
  get_term_and_condition,
  create_or_edit_term_and_condition,
  delete_term_and_condition,
} = require("../controllers/termsAndConditions");
const {
  authorize_handle_auth,
  authorize_only_workers,
} = require("../middleware/check-for-auth");

router.get("/", get_terms_and_conditions);
router.get("/:id", get_term_and_condition);
router.patch("/", authorize_only_workers, create_or_edit_term_and_condition);
router.delete("/:id", authorize_handle_auth, delete_term_and_condition);

module.exports = router;
